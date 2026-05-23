<template>
  <Sidebar ref="sidebar" :title="$t('chemicalSidebar.title')">
    <div class="box" :class="{ isDark: isDark }">
      <!-- 拼接输入区 -->
      <div class="inputSection">
        <el-input
          ref="inputRef"
          v-model="formulaText"
          :rows="3"
          resize="none"
          type="textarea"
          :placeholder="$t('chemicalSidebar.placeholder')"
          @keydown.native.stop
        />
        <div class="previewArea" v-if="previewHtml" v-html="previewHtml"></div>
        <div class="actionRow">
          <el-button size="small" type="primary" @click="confirm" :disabled="!formulaText.trim()">
            {{ $t('chemicalSidebar.confirm') }}
          </el-button>
          <el-button size="small" @click="formulaText = ''">清空</el-button>
        </div>
      </div>

      <el-tabs v-model="activeTab" type="border-card" class="builderTabs">
        <!-- 元素 Tab -->
        <el-tab-pane :label="$t('chemicalSidebar.elements')" name="elements">
          <div class="elementSection customScrollbar">
            <div class="elementGrid">
              <div class="elementBtn" v-for="el in elementList" :key="el" @click="appendText(el)">{{ el }}</div>
            </div>
            <div class="sectionTitle" style="margin-top: 8px;">数字（点击插入下标/上标）</div>
            <div class="numberRow">
              <span class="hintLabel">下标</span>
              <div class="numberBtn" v-for="n in numberList" :key="'sub'+n" @click="appendText('_{' + n + '}')">{{ n }}</div>
              <span class="hintLabel" style="margin-left: 10px;">上标</span>
              <div class="numberBtn charge" v-for="n in numberList" :key="'sup'+n" @click="appendText('^{' + n + '}')">{{ n }}</div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 符号 Tab -->
        <el-tab-pane :label="$t('chemicalSidebar.symbols')" name="symbols">
          <div class="symbolsScroll customScrollbar">
            <div class="symbolSection">
              <div class="sectionTitle">{{ $t('chemicalSidebar.arrows') }}</div>
              <div class="symbolGrid">
                <div class="symbolBtn" v-for="item in arrowSymbols" :key="item.label" @click="appendText(item.tex)">
                  <span class="symbolLabel">{{ item.label }}</span>
                  <span class="symbolDesc">{{ item.desc }}</span>
                </div>
              </div>
            </div>
            <div class="symbolSection">
              <div class="sectionTitle">{{ $t('chemicalSidebar.conditions') }}</div>
              <div class="symbolGrid">
                <div class="symbolBtn" v-for="item in conditionSymbols" :key="item.label" @click="appendText(item.tex)">
                  <span class="symbolLabel">{{ item.label }}</span>
                  <span class="symbolDesc">{{ item.desc }}</span>
                </div>
              </div>
            </div>
            <div class="symbolSection">
              <div class="sectionTitle">{{ $t('chemicalSidebar.ions') }}</div>
              <div class="symbolGrid">
                <div class="symbolBtn" v-for="item in ionSymbols" :key="item.label" @click="appendText(item.tex)">
                  <span class="symbolLabel">{{ item.label }}</span>
                  <span class="symbolDesc">{{ item.desc }}</span>
                </div>
              </div>
            </div>
            <div class="symbolSection">
              <div class="sectionTitle">其他</div>
              <div class="symbolGrid">
                <div class="symbolBtn" v-for="item in otherSymbols" :key="item.label" @click="appendText(item.tex)">
                  <span class="symbolLabel">{{ item.label }}</span>
                  <span class="symbolDesc">{{ item.desc }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 方程式模板 Tab -->
        <el-tab-pane :label="$t('chemicalSidebar.templates')" name="templates">
          <el-radio-group v-model="equationCategory" size="mini" class="categoryFilter">
            <el-radio-button label="all">{{ $t('chemicalSidebar.category_all') }}</el-radio-button>
            <el-radio-button label="inorganic">{{ $t('chemicalSidebar.category_inorganic') }}</el-radio-button>
            <el-radio-button label="organic">{{ $t('chemicalSidebar.category_organic') }}</el-radio-button>
            <el-radio-button label="electrochemistry">{{ $t('chemicalSidebar.category_electrochemistry') }}</el-radio-button>
            <el-radio-button label="ion">{{ $t('chemicalSidebar.category_ion') }}</el-radio-button>
          </el-radio-group>
          <div class="templateList customScrollbar">
            <div class="templateItem" v-for="(item, index) in filteredTemplates" :key="index" @click="formulaText = item.tex">
              <div class="templateLabel">{{ item.label }}</div>
              <div class="templatePreview" v-html="getPreview(item.tex)"></div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from './Sidebar.vue'
import { mapState, mapMutations } from 'vuex'
import {
  chemicalElementList,
  chemicalSymbolList,
  chemicalEquationTemplates,
  numberList
} from '@/config/chemicalTemplates'

export default {
  components: { Sidebar },
  props: {
    mindMap: { type: Object }
  },
  data() {
    return {
      activeTab: 'elements',
      equationCategory: 'all',
      formulaText: '',
      activeNodes: [],
      elementList: chemicalElementList,
      equationTemplates: chemicalEquationTemplates,
      numberList
    }
  },
  computed: {
    ...mapState({
      activeSidebar: state => state.activeSidebar,
      isDark: state => state.localConfig.isDark,
      localConfig: state => state.localConfig
    }),
    arrowSymbols() {
      return chemicalSymbolList.filter(s => s.type === 'arrow')
    },
    conditionSymbols() {
      return chemicalSymbolList.filter(s => s.type === 'condition')
    },
    ionSymbols() {
      return chemicalSymbolList.filter(s => s.type === 'charge')
    },
    otherSymbols() {
      return chemicalSymbolList.filter(s => s.type === 'state' || s.type === 'op')
    },
    filteredTemplates() {
      if (this.equationCategory === 'all') return this.equationTemplates
      return this.equationTemplates.filter(t => t.category === this.equationCategory)
    },
    previewHtml() {
      if (!this.formulaText.trim()) return ''
      try {
        return window.katex.renderToString(this.formulaText.trim(), {
          throwOnError: false,
          errorColor: '#f00'
        })
      } catch (e) {
        return ''
      }
    }
  },
  watch: {
    activeSidebar(val) {
      if (val === 'chemicalSidebar') {
        this.$refs.sidebar.show = true
      } else {
        this.$refs.sidebar.show = false
      }
    }
  },
  created() {
    this.$bus.$on('node_active', this.handleNodeActive)
  },
  beforeDestroy() {
    this.$bus.$off('node_active', this.handleNodeActive)
  },
  methods: {
    ...mapMutations(['setActiveSidebar']),

    handleNodeActive(...args) {
      this.activeNodes = [...args[1]]
      if (this.activeNodes.length <= 0 && this.activeSidebar === 'chemicalSidebar') {
        this.setActiveSidebar(null)
      }
    },

    appendText(tex) {
      this.formulaText = this.formulaText.trim() + tex
      this.$nextTick(() => {
        const el = this.$refs.inputRef
        if (el) {
          const textarea = el.$el ? el.$el.querySelector('textarea') : el.querySelector('textarea')
          if (textarea) {
            textarea.focus()
            textarea.setSelectionRange(9999, 9999)
          }
        }
      })
    },

    getPreview(tex) {
      try {
        return window.katex.renderToString(tex, {
          throwOnError: false,
          errorColor: '#f00'
        })
      } catch (e) {
        return ''
      }
    },

    confirm() {
      if (!this.localConfig.openNodeRichText) {
        return this.$message.warning(this.$t('chemicalSidebar.tip'))
      }
      let str = this.formulaText.trim()
      if (!str) return
      this.mindMap.execCommand('INSERT_FORMULA', str)
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  padding: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &.isDark {
    .elementBtn { color: #ccc; background-color: #363b3f; border-color: #4a4f54;
      &:hover { background-color: #4a4f54; color: #fff; } }
    .symbolBtn { color: #ccc; background-color: #363b3f; border-color: #4a4f54;
      &:hover { background-color: #4a4f54; } }
    .numberBtn { color: #ccc; background-color: #363b3f; border-color: #4a4f54;
      &:hover { background-color: #4a4f54; color: #fff; } }
    .templateItem { border-color: #4a4f54;
      &:hover { background-color: #363b3f; }
      .templateLabel { color: #ccc; } }
    .sectionTitle { color: #aaa; }
    .hintLabel { color: #aaa; }
    /deep/ .el-textarea__inner { background-color: transparent; color: #fff; }
    /deep/ .el-tabs__item { color: #ccc; }
    /deep/ .el-radio-button__inner { background-color: #363b3f; border-color: #4a4f54; color: #ccc; }
  }

  .inputSection {
    flex-shrink: 0;
    margin-bottom: 6px;
    .previewArea {
      min-height: 30px; padding: 6px 10px; margin-top: 4px;
      border: 1px dashed #dcdfe6; border-radius: 4px;
      display: flex; align-items: center; justify-content: center;
      overflow-x: auto; overflow-y: hidden;
    }
    .actionRow {
      display: flex; gap: 6px; margin-top: 6px;
      .el-button { flex: 1; }
    }
  }

  .builderTabs {
    flex: 1; overflow: hidden; display: flex; flex-direction: column;
    /deep/ .el-tabs__content { flex: 1; overflow: hidden; padding: 0; }
    /deep/ .el-tab-pane { height: 100%; overflow: hidden; }
  }

  .elementSection {
    height: 100%; overflow-y: auto; padding: 4px 0;
    .elementGrid {
      display: flex; flex-wrap: wrap; gap: 5px;
      .elementBtn {
        display: inline-flex; align-items: center; justify-content: center;
        width: 40px; height: 30px; font-size: 13px; font-weight: 500;
        border: 1px solid #dcdfe6; border-radius: 4px; cursor: pointer;
        background-color: #fafafa; transition: all 0.2s;
        &:hover { background-color: #409eff; color: #fff; border-color: #409eff; }
      }
    }
    .sectionTitle { font-size: 13px; color: #909399; margin-bottom: 4px; }
    .numberRow { display: flex; flex-wrap: wrap; gap: 3px; align-items: center; }
    .hintLabel { font-size: 11px; color: #909399; margin-right: 2px; }
    .numberBtn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 26px; height: 24px; font-size: 12px; font-weight: 500;
      border: 1px solid #dcdfe6; border-radius: 3px; cursor: pointer;
      background-color: #f0f9ff; transition: all 0.15s;
      &:hover { background-color: #67c23a; color: #fff; border-color: #67c23a; }
      &.charge { background-color: #fef0f0;
        &:hover { background-color: #f56c6c; color: #fff; border-color: #f56c6c; } }
    }
  }

  .symbolsScroll { height: 100%; overflow-y: auto; padding: 4px 0; }
  .symbolSection { margin-bottom: 8px;
    .sectionTitle { font-size: 13px; color: #909399; margin-bottom: 4px; } }
  .symbolGrid {
    display: flex; flex-wrap: wrap; gap: 5px;
    .symbolBtn {
      display: flex; flex-direction: column; align-items: center;
      padding: 3px 7px; border: 1px solid #dcdfe6; border-radius: 4px;
      cursor: pointer; background-color: #fafafa; transition: all 0.2s; min-width: 44px;
      &:hover { background-color: #ecf5ff; border-color: #409eff; }
      .symbolLabel { font-size: 14px; font-weight: 500; }
      .symbolDesc { font-size: 10px; color: #909399; }
    }
  }

  .categoryFilter { margin-bottom: 6px; display: flex; flex-wrap: wrap;
    /deep/ .el-radio-button { margin-bottom: 2px; } }
  .templateList { height: calc(100% - 40px); overflow-y: auto;
    .templateItem {
      display: flex; align-items: center; padding: 6px 8px;
      border: 1px solid #ebeef5; border-radius: 4px; margin-bottom: 4px; cursor: pointer;
      transition: all 0.2s;
      &:hover { background-color: #ecf5ff; }
      .templateLabel { font-size: 12px; color: #606266; width: 80px; flex-shrink: 0;
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .templatePreview { flex: 1; overflow-x: auto; display: flex; justify-content: center;
        min-height: 24px; align-items: center; }
    }
  }
}
</style>
