<template>
	
  <view class="uni-container">
	  <div class="title">
	    <!-- 这里放置 Bomp 的标题 -->
	    <h2>Bomp一下</h2>
	  </div>
    <uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="title" label="">
        <uni-easyinput v-model="formData.title"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="article" label="">
        <uni-easyinput v-model="formData.article"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="image" label="">
        <uni-file-picker return-type="object" v-model="formData.image"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="tag" label="">
        <uni-data-checkbox v-model="formData.tag" :localdata="formOptions.tag_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="mobile" label="">
        <uni-easyinput v-model="formData.mobile"></uni-easyinput>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/tiezi.js';

  const db = uniCloud.database();
  const dbCollectionName = 'tiezi';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.indexOf(key) > -1) {
        result[key] = validator[key]
      }
    }
    return result
  }

  

  export default {
    data() {
      let formData = {
        "title": "",
        "article": "",
        "image": null,
        "tag": 0,
        "mobile": "",
        "user_id": ""
      }
      return {
        formData,
        formOptions: {
          "tag_localdata": [
            {
              "text": "志愿活动",
              "value": 0
            },
            {
              "text": "运动",
              "value": 1
            },
            {
              "text": "随手拍",
              "value": 2
            }
          ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      
      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            icon: 'none',
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>

<style>
	.title{
		text-align: center;
	}
  .uni-container {
    padding: 15px;
  }

  .uni-input-border,
  .uni-textarea-border {
    width: 80%;
    font-size: 14px;
    color: #666;
    border: 1px #e5e5e5 solid;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .uni-input-border {
    padding: 0 10px;
    height: 35px;

  }

  .uni-textarea-border {
    padding: 10px;
    height: 80px;
  }

  .uni-button-group {
    margin-top: 50px;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    justify-content: center;
  }

  .uni-button {
    width: 100px;
  }
</style>
