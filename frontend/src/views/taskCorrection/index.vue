<template>
  <div class="main-area">
    <el-card>
      <center>
        <h3>{{ task.title }}</h3>
      </center>
      <el-form v-model="correction">
        <el-form-item v-for="(question, index) in task.content" :key="index+''">
          <el-form>
            <el-form-item :label="index+1+''">
              <div v-html="markdown2HTML(question.question)" />
            </el-form-item>
            <el-form-item :label="'回答'">
              <div v-html="markdown2HTML(submission[index])" />
            </el-form-item>
            <el-form-item :label="'答案'">
              <div v-html="markdown2HTML(task.solution[index])" />
            </el-form-item>
          </el-form>
          <el-form v-model="correction[index]">
            <el-form-item :label="'给分'" :rules="[{ required: true, message: '打分不能为空', trigger: 'blur' }]">
              <el-input v-model="correction.grade" placeholder="请打分" />
            </el-form-item>
            <el-form-item :label="'批语'">
              <el-input v-model="correction.extra" placeholder="请写批语" />
            </el-form-item>
          </el-form>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import marked from 'marked'
import { get, post } from '@/api/client'

export default {
  name: 'Index',
  data() {
    return {
      taskId: '',
      userId: '',
      task: [],
      submission: [],
      correction: []
    }
  },
  created() {
    if (this.$router.currentRoute.query.taskId !== undefined && this.$router.currentRoute.query.userId !== undefined) {
      this.taskId = this.$router.currentRoute.query.taskId
      this.userId = this.$router.currentRoute.query.userId
      this.init().catch(err => {
        this.$message.error('加载失败：' + err)
      })
    }
  },
  methods: {
    async init() {
      const task = await get('task/get_task', { taskId: this.taskId })
      // 获取作业内容
      const questionContent = []
      for (const id in task.data.content) {
        const question = this.json2Str((task.data.content)[id].question)
        questionContent.push({
          type: (task.data.content)[id].type,
          question: question,
          grade: (task.data.content)[id].grade
        })
        this.correction.push({
          grade: '',
          extra: ''
        })
      }
      // 获取答案内容
      const solutionContent = []
      for (const id in task.data.solution) {
        const solution = this.json2Str((task.data.solution)[id])
        solutionContent.push(solution)
      }
      // 获取题目
      const submission = await get('task/get_submission', { taskId: this.taskId, userId: this.userId })
      const submissionContent = []
      for (const id in submission.data.answer) {
        const ans = this.json2Str(submission.data.answer[id])
        submissionContent.push(ans)
      }
      this.task = { title: task.data.title, content: questionContent, solution: solutionContent }
      this.submission = submissionContent
    },
    submitForm() {
      const content = {}
      for (let i = 0; i < this.correction.length; ++i) {
        content['' + i] = this.correction[i]
      }
      const form = {
        taskId: this.taskId,
        userId: this.userId,
        state: '1',
        content: content
      }
      post('task/correct_task', form).then(res => {
        // 成功
        this.$message({
          message: '提交成功',
          type: 'success',
          duration: 2000
        })
        this.$router.back()
      }).catch(err => {
        // 失败
        this.$message({
          message: '提交失败' + err,
          type: 'error',
          duration: 2000
        })
      })
    },
    json2Str(json) {
      let str = ''
      for (const el in json) {
        str += json[el].content
      }
      return str
    },
    str2Json(str) {
      if (str === undefined || str === null || str.length === 0) return {}

      let pre = 0
      let cur = 0
      let cnt = 0
      const json = {}
      while (cur < str.length) {
        if (str[cur] === '!') {
          // text型提取
          json['' + cnt] = {
            type: 'text',
            content: str.substring(pre, cur)
          }
          cnt++
          pre = cur
          // image型提取 TODO
        }
        cur++
      }
      return json
    },
    markdown2HTML(md) {
      return marked(md)
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
