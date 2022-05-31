import { defineComponent, ref, onMounted } from 'vue';
import { book } from '@/service';
import { useRouter } from 'vue-router';
import { message, Modal, Input } from 'ant-design-vue';
import { result, formatTimestamp } from '@/helpers/utils';
import { getHeaders } from '@/helpers/request';
import { getClassifyTitleById } from '@/helpers/book-classify';
import AddOne from './AddOne/index.vue';
import Update from './Update/index.vue';

export default defineComponent({
  components: {
    AddOne,
    Update,
  },
  props: {
    simple: Boolean,
  },
  setup(props) {
    const router = useRouter();

    const columns = [
      {
        title: '书名',
        dataIndex: 'name',
      },

      {
        title: '作者',
        dataIndex: 'author',
      },

      {
        title: '价格',
        dataIndex: 'price',
      },

      {
        title: '库存',
        dataIndex: 'count',
        slots: {
          customRender: 'count',
        },
      },

      {
        title: '出版日期',
        dataIndex: 'publishDate',
        slots: {
          customRender: 'publishDate',
        },
      },

      {
        title: '分类',
        slots: {
          customRender: 'classify',
        },
      }, 

     
    ];

    if (!props.simple){
      columns.push({
        title: '操作',
        slots: {
          customRender: 'actions',
        },
      });
    }
   
    const show = ref(false); //弹窗默认关闭
    const showUpdateModal = ref(false);
    const list = ref([]);    //列表数组默认空
    const total = ref(0);
    const curPage = ref(1);   //页码从1开始
    const keyword = ref('');   //搜索关键字
    const isSearch = ref(false); //判断是否在搜索状态
    const curEditBook =ref({});
    //const bookClassifyList = ref([]);
    //const classifyLoading = ref(true);




    //获取书籍分类列表
    // const getBookClassify = async () => {
    //   classifyLoading.value = true;
    //   const res = await bookClassify.list();
    //   classifyLoading.value = false;

    //   result(res)
    //     .success(({ data }) => {
    //       bookClassifyList.value = data;
    //     });
    
    // };

    //获取书籍列表
    const getList = async () => {
      //拿到当前页码
      const res = await book.list({
        page: curPage.value,
        size: 10,
        keyword: keyword.value,
      });
      
      //解构data 拿到list,total,page,size 重命名 list total
      result(res)
        .success(({ data }) => {
          const { list:l, total:t } =data;
          list.value = l;
          total.value = t;
        });
    };

    onMounted(async () => {
     // await getBookClassify();
      getList();
    });

    //设置页码切页
    const setPage = (page) => {
      curPage.value = page;
      getList(); 
    }

    //触发搜索
    const onSearch = () => {
      getList();

      //字符串转bool有则true，空为false
      isSearch.value = Boolean(keyword.value);
    }

    //搜索后返回总列表
    const backAll = () => {
      keyword.value = '';
      isSearch.value = false;
      getList();
    }

    //删除一本书
    const remove = async ({ text: record }) => {
      
      const { _id } = record;

      const res = await book.remove(_id);

      result(res)
        .success(({ msg }) => {
          message.success(msg);
          //刷新列表
          getList();
        });
    };
    

    //出入库
    const updateCount = (type, record) => {
      let word = '增加';
      
      if (type === 'OUT_COUNT') {
        word = '减少';
      }
      Modal.confirm({
        title: `要${word}多少库存`,
        content: (
          <div>
            <Input class="__book_input_count" />
          </div>
        ),

        onOk: async () => {
          const el = document.querySelector('.__book_input_count');
          let num = el.value;

          const res = await book.updateCount({
            id: record._id,
            num,
            type,
          });

          result(res)
            .success((data) => {
              
              if(type === 'IN_COUNT') {
                  //入库
                num = Math.abs(num);
              }else {
                  //出库
                num = -(Math.abs(num));
              }

              const one = list.value.find((item) => {
                return item._id === record._id;
              });

              if (one) {
                one.count = one.count + num;

                message.success(`成功${word} ${Math.abs(num)} 本书`);
              }
            });
          
        },

      });
    };

    //编辑弹框
    const update = ({ record }) => {
      showUpdateModal.value = true;
      curEditBook.value = record;
    };

    //更新书籍信息
    const updateCurBook = (newData) =>  {
      Object.assign(curEditBook.value, newData);
    };

    //进入书籍详情页
    const toDetail = ({ record }) =>{
      router.push(`/books/${record._id}`);
    };

    const onUploadChange = ({ file }) => {
      if(file.response) {
        result(file.response)
          .success(async (key) => {
            const res = await book.addMany(key);
            
            result(res)
            .success(({ data: { addCount } }) => {
              message.success(`成功添加 ${addCount} 本书`);

              getList();
            });
          
          });
      }
    };

    return{
        columns,
        show,
        list,
        total,
        formatTimestamp,
        curPage,
        setPage,
        keyword,
        onSearch,
        backAll,
        isSearch,
        remove,
        updateCount,
        showUpdateModal,
        update,
        curEditBook,
        updateCurBook,
        toDetail,
        getList,
        getClassifyTitleById,
        simple: props.simple,
        //classifyLoading,
        //bookClassifyList,
        onUploadChange,
        headers: getHeaders(),
    };
  },

});