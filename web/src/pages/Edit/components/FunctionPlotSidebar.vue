<template>
  <Sidebar ref="sidebar" :title="$t('functionPlotSidebar.title')">
    <div class="box" :class="{ isDark: isDark }">
      <!-- 表达式输入 -->
      <div class="inputSection">
        <div class="label">{{ $t('functionPlotSidebar.expression') }}</div>
        <el-input
          v-model="expression"
          :placeholder="$t('functionPlotSidebar.expressionPlaceholder')"
          @input="scheduleRender"
          @keydown.native.stop
          clearable
        />
        <div class="errorMsg" v-if="errorMsg">{{ errorMsg }}</div>
      </div>

      <!-- 预设函数 -->
      <div class="presetSection">
        <div class="label">{{ $t('functionPlotSidebar.presets') }}</div>
        <div class="presetGrid">
          <div
            class="presetBtn"
            v-for="item in presetFunctions"
            :key="item.expr"
            @click="selectPreset(item)"
          >
            <div class="presetExpr">{{ item.display }}</div>
            <div class="presetName">{{ item.label }}</div>
          </div>
        </div>
      </div>

      <!-- 参数面板 -->
      <el-collapse v-model="paramsVisible" class="paramsCollapse">
        <el-collapse-item
          :title="$t('functionPlotSidebar.params')"
          name="params"
        >
          <div class="paramRow">
            <span class="paramLabel">{{ $t('functionPlotSidebar.xRange') }}</span>
            <el-input-number
              v-model="xMin"
              :step="1"
              size="mini"
              controls-position="right"
              style="width: 90px;"
            ></el-input-number>
            <span class="paramSep">~</span>
            <el-input-number
              v-model="xMax"
              :step="1"
              size="mini"
              controls-position="right"
              style="width: 90px;"
            ></el-input-number>
          </div>
          <div class="paramRow">
            <span class="paramLabel">{{ $t('functionPlotSidebar.color') }}</span>
            <el-color-picker v-model="lineColor" size="mini"></el-color-picker>
          </div>
          <div class="paramRow">
            <span class="paramLabel">{{ $t('functionPlotSidebar.lineWidth') }}</span>
            <el-slider v-model="lineWidth" :min="1" :max="4" style="width: 120px;"></el-slider>
          </div>
          <div class="paramRow">
            <el-checkbox v-model="showGrid">{{ $t('functionPlotSidebar.showGrid') }}</el-checkbox>
          </div>
          <div class="paramRow">
            <el-checkbox v-model="showAxes">{{ $t('functionPlotSidebar.showAxes') }}</el-checkbox>
          </div>
        </el-collapse-item>
      </el-collapse>

      <!-- Canvas 预览 -->
      <div class="canvasWrap">
        <canvas
          ref="canvas"
          width="400"
          height="300"
          class="previewCanvas"
        ></canvas>
      </div>

      <!-- 操作按钮 -->
      <el-button
        size="small"
        type="primary"
        style="width: 100%;"
        :disabled="!canInsert"
        @click="confirm"
      >{{ $t('functionPlotSidebar.insert') }}</el-button>
    </div>
  </Sidebar>
</template>

<script>
import Sidebar from './Sidebar.vue'
import { mapState, mapMutations } from 'vuex'

const presetFunctions = [
  { display: 'y = x²', expr: 'x^2', label: '二次函数' },
  { display: 'y = x³', expr: 'x^3', label: '三次函数' },
  { display: 'y = 1/x', expr: '1/x', label: '反比例函数' },
  { display: 'y = sin(x)', expr: 'sin(x)', label: '正弦函数' },
  { display: 'y = cos(x)', expr: 'cos(x)', label: '余弦函数' },
  { display: 'y = |x|', expr: 'abs(x)', label: '绝对值函数' },
  { display: 'y = eˣ', expr: 'exp(x)', label: '指数函数' },
  { display: 'y = ln(x)', expr: 'log(x)', label: '对数函数' },
  { display: 'y = √x', expr: 'sqrt(x)', label: '平方根函数' },
  { display: 'y = -x²+2x+3', expr: '-x^2+2*x+3', label: '二次函数2' }
]

function sanitizeExpression(expr) {
  // 只允许安全的字符: x, 数字, 运算符, 括号, 小数点和空格
  const allowed = /^[x0-9+\-*/().%\s^]*$/
  if (!allowed.test(expr)) {
    // 如果包含函数名，允许字母
    const funcAllowed = /^[x0-9+\-*/().%\s^a-zA-Z]*$/
    if (!funcAllowed.test(expr)) {
      return null
    }
  }
  return expr
    .replace(/\^/g, '**')
    .replace(/\babs\b/g, 'Math.abs')
    .replace(/\bsin\b/g, 'Math.sin')
    .replace(/\bcos\b/g, 'Math.cos')
    .replace(/\btan\b/g, 'Math.tan')
    .replace(/\bexp\b/g, 'Math.exp')
    .replace(/\blog\b/g, 'Math.log')
    .replace(/\bsqrt\b/g, 'Math.sqrt')
    .replace(/\bPI\b/g, 'Math.PI')
    .replace(/\bpi\b/g, 'Math.PI')
}

export default {
  components: {
    Sidebar
  },
  props: {
    mindMap: {
      type: Object
    }
  },
  data() {
    return {
      expression: '',
      xMin: -10,
      xMax: 10,
      lineColor: '#2196F3',
      lineWidth: 2,
      showGrid: true,
      showAxes: true,
      paramsVisible: [],
      errorMsg: '',
      activeNodes: [],
      presetFunctions,
      renderTimer: null
    }
  },
  computed: {
    ...mapState({
      activeSidebar: state => state.activeSidebar,
      isDark: state => state.localConfig.isDark,
      localConfig: state => state.localConfig
    }),

    canInsert() {
      return this.expression.trim().length > 0 && !this.errorMsg
    }
  },
  watch: {
    activeSidebar(val) {
      if (val === 'functionPlotSidebar') {
        this.$refs.sidebar.show = true
      } else {
        this.$refs.sidebar.show = false
      }
    },
    expression() {
      this.scheduleRender()
    },
    xMin() { this.scheduleRender() },
    xMax() { this.scheduleRender() },
    lineColor() { this.scheduleRender() },
    lineWidth() { this.scheduleRender() },
    showGrid() { this.scheduleRender() },
    showAxes() { this.scheduleRender() }
  },
  created() {
    this.$bus.$on('node_active', this.handleNodeActive)
  },
  beforeDestroy() {
    this.$bus.$off('node_active', this.handleNodeActive)
  },
  mounted() {
    this.renderPlot()
  },
  methods: {
    ...mapMutations(['setActiveSidebar']),

    handleNodeActive(...args) {
      this.activeNodes = [...args[1]]
      if (
        this.activeNodes.length <= 0 &&
        this.activeSidebar === 'functionPlotSidebar'
      ) {
        this.setActiveSidebar(null)
      }
    },

    selectPreset(item) {
      this.expression = item.expr
    },

    scheduleRender() {
      clearTimeout(this.renderTimer)
      this.renderTimer = setTimeout(() => {
        this.renderPlot()
      }, 200)
    },

    renderPlot() {
      const canvas = this.$refs.canvas
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const W = canvas.width
      const H = canvas.height
      const expr = this.expression.trim()

      // 清空
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = this.isDark ? '#1e1e1e' : '#ffffff'
      ctx.fillRect(0, 0, W, H)

      if (!expr) {
        this.errorMsg = ''
        return
      }

      const sanitized = sanitizeExpression(expr)
      if (!sanitized) {
        this.errorMsg = this.$t('functionPlotSidebar.invalidExpression')
        return
      }

      let fn
      try {
        fn = new Function('x', `return ${sanitized}`)
        // 测试求值
        fn(0)
      } catch (e) {
        this.errorMsg = this.$t('functionPlotSidebar.invalidExpression')
        return
      }
      this.errorMsg = ''

      // 自动计算 y 范围
      let yMin = Infinity
      let yMax = -Infinity
      const samples = 200
      for (let i = 0; i <= samples; i++) {
        const x = this.xMin + (this.xMax - this.xMin) * (i / samples)
        try {
          const y = fn(x)
          if (isFinite(y) && Math.abs(y) < 1e6) {
            if (y < yMin) yMin = y
            if (y > yMax) yMax = y
          }
        } catch (e) {}
      }
      if (yMin === Infinity) {
        yMin = -10
        yMax = 10
      }
      // 给 y 范围增加一点边距
      const yRange = yMax - yMin || 1
      yMin -= yRange * 0.1
      yMax += yRange * 0.1

      // 坐标变换
      const toPx = (x) => ((x - this.xMin) / (this.xMax - this.xMin)) * W
      const toPy = (y) => H - ((y - yMin) / (yMax - yMin)) * H

      // 网格
      if (this.showGrid) {
        ctx.strokeStyle = this.isDark ? '#333' : '#e0e0e0'
        ctx.lineWidth = 0.5
        const xStep = (this.xMax - this.xMin) / 10
        const yStep = (yMax - yMin) / 8
        for (let i = 0; i <= 10; i++) {
          const px = toPx(this.xMin + xStep * i)
          ctx.beginPath()
          ctx.moveTo(px, 0)
          ctx.lineTo(px, H)
          ctx.stroke()
        }
        for (let i = 0; i <= 8; i++) {
          const py = toPy(yMin + yStep * i)
          ctx.beginPath()
          ctx.moveTo(0, py)
          ctx.lineTo(W, py)
          ctx.stroke()
        }
      }

      // 坐标轴
      if (this.showAxes) {
        ctx.strokeStyle = this.isDark ? '#aaa' : '#333'
        ctx.lineWidth = 1.2
        const originX = toPx(0)
        const originY = toPy(0)
        if (originX >= 0 && originX <= W) {
          ctx.beginPath()
          ctx.moveTo(originX, 0)
          ctx.lineTo(originX, H)
          ctx.stroke()
        }
        if (originY >= 0 && originY <= H) {
          ctx.beginPath()
          ctx.moveTo(0, originY)
          ctx.lineTo(W, originY)
          ctx.stroke()
        }
      }

      // 函数曲线
      ctx.strokeStyle = this.lineColor
      ctx.lineWidth = this.lineWidth
      ctx.beginPath()
      const step = (this.xMax - this.xMin) / (W * 2)
      let firstPoint = true
      for (let x = this.xMin; x <= this.xMax; x += step) {
        try {
          const y = fn(x)
          if (!isFinite(y) || Math.abs(y) > 1e6) {
            firstPoint = true
            continue
          }
          const px = toPx(x)
          const py = toPy(y)
          if (py < -1000 || py > H + 1000) {
            firstPoint = true
            continue
          }
          if (firstPoint) {
            ctx.moveTo(px, py)
            firstPoint = false
          } else {
            ctx.lineTo(px, py)
          }
        } catch (e) {
          firstPoint = true
        }
      }
      ctx.stroke()
    },

    confirm() {
      if (this.activeNodes.length <= 0) {
        this.$message.warning(this.$t('functionPlotSidebar.selectNodeFirst'))
        return
      }
      const canvas = this.$refs.canvas
      const dataURL = canvas.toDataURL('image/png')
      this.activeNodes.forEach(node => {
        node.setImage({
          url: dataURL,
          title: `y = ${this.expression.trim()}`,
          width: 400,
          height: 300
        })
      })
      this.$message.success(this.$t('functionPlotSidebar.insertSuccess'))
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
  overflow-y: auto;

  &.isDark {
    .label { color: #ccc; }
    .presetBtn {
      background-color: #363b3f;
      border-color: #4a4f54;
      color: #ccc;
      &:hover { background-color: #4a4f54; }
      .presetName { color: #909399; }
    }
    .errorMsg { color: #f56c6c; }
    /deep/ .el-input__inner {
      background-color: transparent;
      color: #fff;
    }
    /deep/ .el-input-number__decrease,
    /deep/ .el-input-number__increase {
      background-color: #363b3f;
      color: #ccc;
    }
    /deep/ .el-input-number input {
      background-color: transparent;
      color: #fff;
    }
    /deep/ .el-checkbox__label { color: #ccc; }
  }

  .inputSection {
    .label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 6px;
    }
    .errorMsg {
      color: #f56c6c;
      font-size: 12px;
      margin-top: 4px;
    }
  }

  .presetSection {
    margin-top: 12px;
    .label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 6px;
    }
    .presetGrid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      .presetBtn {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 4px 10px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        cursor: pointer;
        background-color: #fafafa;
        transition: all 0.2s;
        &:hover {
          background-color: #ecf5ff;
          border-color: #409eff;
        }
        .presetExpr {
          font-size: 13px;
          font-weight: 500;
          font-style: italic;
        }
        .presetName {
          font-size: 10px;
          color: #909399;
        }
      }
    }
  }

  .paramsCollapse {
    margin-top: 10px;
    /deep/ .el-collapse-item__header {
      font-size: 14px;
      font-weight: 500;
    }
    /deep/ .el-collapse-item__content {
      padding-bottom: 0;
    }
    .paramRow {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .paramLabel {
        width: 60px;
        font-size: 13px;
        color: #606266;
      }
      .paramSep {
        margin: 0 6px;
      }
    }
  }

  .canvasWrap {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    .previewCanvas {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      max-width: 100%;
      height: auto;
    }
  }
}
</style>
