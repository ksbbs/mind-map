<template>
  <el-dialog
    class="nodeTagDialog"
    :title="$t('nodeTag.title')"
    :visible.sync="dialogVisible"
    :width="isMobile ? '90%' : '50%'"
    :top="isMobile ? '20px' : '15vh'"
  >
    <el-input
      v-model="tag"
      @keyup.native.enter="add"
      @keyup.native.stop
      @keydown.native.stop
      :disabled="tagArr.length >= max"
      :placeholder="$t('nodeTag.addTip')"
    >
    </el-input>
    <el-collapse class="subjectCollapse" v-if="tagArr.length < max">
      <el-collapse-item :title="$t('nodeTag.subjectTags')" name="subjects">
        <div class="subjectGroup" v-for="(labels, subject) in subjectTagPresets" :key="subject">
          <div class="subjectName">{{ subject }}</div>
          <div class="subjectChipList">
            <el-tag
              class="subjectChip"
              v-for="label in labels"
              :key="label"
              size="mini"
              :hit="!tagArr.includes(label)"
              @click.native="addPreset(label)"
            >{{ label }}</el-tag>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div class="tagList">
      <div
        class="tagItem"
        v-for="(item, index) in tagArr"
        :key="index"
        :style="{
          backgroundColor: generateColorByContent(item)
        }"
      >
        {{ typeof item === 'string' ? item : item.text }}
        <div class="delBtn" @click="del(index)">
          <span class="iconfont iconshanchu"></span>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('dialog.cancel') }}</el-button>
      <el-button type="primary" @click="confirm">{{
        $t('dialog.confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  generateColorByContent,
  isMobile
} from 'simple-mind-map/src/utils/index'

// 学科标签预设
const subjectTagPresets = {
  '数学': ['函数', '几何', '代数', '概率', '三角函数', '数列', '向量', '圆锥曲线', '导数', '立体几何', '解析几何', '复数'],
  '物理': ['力学', '电磁学', '热学', '光学', '原子物理', '运动学', '牛顿定律', '能量', '动量', '电场', '磁场', '电路', '波'],
  '化学': ['无机化学', '有机化学', '电化学', '化学平衡', '离子反应', '氧化还原', '元素周期', '化学键', '化学反应速率', '电解质溶液'],
  '生物': ['细胞', '遗传', '进化', '生态', '光合作用', '呼吸作用', 'DNA', '蛋白质', '酶', '神经调节', '免疫', '基因工程'],
  '英语': ['词汇', '语法', '阅读', '写作', '听力', '完形填空', '翻译', '短语'],
  '语文': ['文言文', '现代文', '作文', '诗歌', '古诗文', '修辞', '成语', '病句']
}

// 节点标签内容设置
export default {
  data() {
    return {
      dialogVisible: false,
      tagArr: [],
      tag: '',
      activeNodes: [],
      max: 5,
      isMobile: isMobile(),
      subjectTagPresets
    }
  },
  watch: {
    dialogVisible(val, oldVal) {
      if (!val && oldVal) {
        this.$bus.$emit('endTextEdit')
      }
    }
  },
  created() {
    this.$bus.$on('node_active', this.handleNodeActive)
    this.$bus.$on('showNodeTag', this.handleShowNodeTag)
  },
  beforeDestroy() {
    this.$bus.$off('node_active', this.handleNodeActive)
    this.$bus.$off('showNodeTag', this.handleShowNodeTag)
  },
  methods: {
    generateColorByContent,

    handleNodeActive(...args) {
      this.activeNodes = [...args[1]]
      if (this.activeNodes.length > 0) {
        let firstNode = this.activeNodes[0]
        this.tagArr = firstNode.getData('tag') || []
      } else {
        this.tagArr = []
        this.tag = ''
      }
    },

    handleShowNodeTag() {
      this.$bus.$emit('startTextEdit')
      this.dialogVisible = true
    },

    add() {
      const text = this.tag.trim()
      if (!text) return
      this.tagArr.push(text)
      this.tag = ''
    },

    addPreset(label) {
      if (this.tagArr.length >= this.max) return
      if (!this.tagArr.includes(label)) {
        this.tagArr.push(label)
      }
    },

    del(index) {
      this.tagArr.splice(index, 1)
    },

    cancel() {
      this.dialogVisible = false
    },

    confirm() {
      this.activeNodes.forEach(node => {
        node.setTag(this.tagArr)
      })
      this.cancel()
    }
  }
}
</script>

<style lang="less" scoped>
.nodeTagDialog {
  .subjectCollapse {
    margin-top: 10px;
    .subjectGroup {
      margin-bottom: 8px;
      .subjectName {
        font-size: 13px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 4px;
      }
      .subjectChipList {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        .subjectChip {
          cursor: pointer;
        }
      }
    }
  }

  .tagList {
    display: flex;
    flex-wrap: wrap;
    margin-top: 5px;

    .tagItem {
      position: relative;
      padding: 3px 5px;
      margin-right: 5px;
      margin-bottom: 5px;
      color: #fff;

      .delBtn {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        visibility: hidden;
      }

      &:hover {
        .delBtn {
          visibility: visible;
        }
      }
    }
  }
}
</style>
