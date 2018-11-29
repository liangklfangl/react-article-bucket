module.exports = `{
    // 列表
    fields:[
        {
        title: '姓名罄天',
        dataIndex: 'categoryName',
        key: 'categoryName',
      }, {
        title: '年龄罄天',
        dataIndex: 'channelName',
        key: 'channelName',
      }, {
        title: '住址罄天',
        dataIndex: 'department',
        key: 'department',
        "render":(text,record)=> { 
          var name ="qinliang";
          var sex = "男";
          var date = new Date();
          return <div>
           住址{text}{record.id}
          </div>
         }
      },{
      "dataIndex":"source",
      "title":"操作",
      "render":(text,record,index)=> { 
        return <div style={{color:"green",cursor:"pointer"}}>
           <Edit record={record} text={text} index={index}>编辑</Edit>
           <Clone record={record} text={text} index={index}>克隆</Clone>
           <SwitchStatus record={record} text={text} index={index}>下线</SwitchStatus>
        </div> 
      }
    }],
      // table,pagination整个组件的layout
      layout:{
       style:{
           marginTop:'20px'
       }
     }, 
    //  下面是table,pagination本身所有的属性
     extra: {
       inEvents:[{
          type:"tp.query"
          // 接受Query查询:直接读取SearchForm的当前值+当前页码即可。ModalBox自己通过form.create()包装
          // 不接受SearchForm的this.props.form这是关键
        }],
       //接受事件
       pagination:{
          // 分页组件接受的props
          pageSize:5,
          style:{
            marginTop:"10px"
          }
       },
       table:{
         url:'https://mocks.alibaba-inc.com/mock/B1HoNkxw7/table/pagination/list'
        // 表格本身支持的props
       }
    }
}`