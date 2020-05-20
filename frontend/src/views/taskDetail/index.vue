<template>
  <div class="main-area">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="作业详情" name="first">
          <center>
            <h3>{{ task.title }}</h3>
            <h5>{{ '截止时间' + task.deadline }}</h5>
          </center>
          <el-form>
            <el-form-item v-for="(content, index) in task.content" :key="index" :label="index+1+''">
              <div v-html="markdown2HTML(content.question)" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="提交情况" name="second">
          <el-table
            :data="submissions"
            border
            style="width: 100%"
          >
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
            />
            <el-table-column
              prop="createdAt"
              label="提交时间"
              align="center"
            />
            <el-table-column
              prop="updatedAt"
              label="更新时间"
              align="center"
            />
            <el-table-column
              prop="state"
              label="状态"
              align="center"
            />
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="gotoCorrect(scope.row)">批改</el-button>
                <el-button type="text" size="small" @click="gotoRedo(scope.row)">打回</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="作业分析" name="third">
          <span>作业分析</span>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { find } from '@/api/client'
import marked from 'marked'

export default {
  name: 'Index',
  data() {
    return {
      taskId: '',
      activeName: 'first',
      task: [],
      submissions: []
    }
  },
  created() {
    if (this.$router.currentRoute.query.taskId !== undefined) {
      this.taskId = this.$router.currentRoute.query.taskId
      this.init().then(_ => {
        this.initSubmissions().catch(err => {
          this.$message.error('加载失败：' + err)
        })
      }).catch(err => {
        this.$message.error('加载失败：' + err)
      })
    }
  },
  methods: {
    async init() {
      const task = await find('task', { data: { taskId: this.taskId }})
      // 获取作业内容
      const questionContent = []
      for (const id in task.data[0].content) {
        const question = this.json2Str((task.data[0].content)[id].question)
        questionContent.push({
          type: (task.data[0].content)[id].type,
          question: question,
          grade: (task.data[0].content)[id].grade
        })
      }
      // 获取答案内容
      const solutionContent = []
      for (const id in task.data[0].solution) {
        const solution = this.json2Str((task.data[0].solution)[id])
        solutionContent.push(solution)
      }
      this.task = {
        createAt: task.data[0].createdAt,
        deadline: task.data[0].deadline,
        solution: solutionContent,
        title: task.data[0].title,
        content: questionContent,
        updatedAt: task.data[0].updatedAt
      }
    },
    async initSubmissions() {
      const submissions = await find('task-submission', { data: { taskId: this.taskId }})
      const submissionsContent = []
      for (const s of submissions.data) {
        const user = await find('user', { data: { userId: s.userId }})
        console.log('user', user)
        const userName = user.data[0].name
        let state = ''
        const hasCorrect = await find('task-correction', { data: { userId: s.userId, taskId: this.taskId }})
        if (hasCorrect.data.length === 0) {
          state = '未批改'
        } else {
          state = hasCorrect.data[0].state === '1' ? '已批改' : '已打回'
        }
        submissionsContent.push({
          userId: s.userId,
          taskId: this.taskId,
          name: userName,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          state: state
        })
      }
      this.submissions = submissionsContent
    },
    gotoCorrect(rowInfo) {
      const userId = rowInfo.userId
      this.$router.push({ path: 'taskCorrection', query: { taskId: this.taskId, userId: userId }})
    },
    gotoRedo(rowInfo) {
      // TODO
    },
    json2Str(json) {
      let str = ''
      for (const el in json) {
        str += json[el].content
      }
      return str
    },
    markdown2HTML(md) {
      return marked(md)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped>
  .main-area{
    padding: 20px;
    height: 100%;
  }
</style>