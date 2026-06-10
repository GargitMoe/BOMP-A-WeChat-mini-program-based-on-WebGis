// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "title": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "article": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "image": {
    "rules": [
      {
        "format": "file"
      }
    ]
  },
  "tag": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
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
          },
		  {
		    "text": "寻物启事",
		    "value": 3
		  },
		  {
		    "text": "小动物们",
		    "value": 4
		  },
		  {
		    "text": "户外演出",
		    "value": 5
		  }
        ]
      }
    ],
    "defaultValue": 0
  },
  "mobile": {
    "rules": [
      {
        "format": "string"
      }
    ]
  },
  "latitude": {
    "rules": [
      {
        "format": "double"
      }
    ]
  },
  "longtitude": {
    "rules": [
      {
        "format": "double"
      }
    ]
  }
}

const enumConverter = {
  "tag_valuetotext": {
    "0": "志愿活动",
    "1": "运动",
    "2": "随手拍",
	"3":"寻物启事",
	"4":"小动物",
	"5":"户外演出",
  }
}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
