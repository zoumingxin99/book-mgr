import { defineComponent, ref, onMounted } from 'vue';
import { book } from '@/service';
import { message, Modal, Input } from 'ant-design-vue';
import { result, formatTimestamp } from '@/helpers/utils';
import AddOne from './AddOne/index.vue';
import Update from './Update/index.vue';

export default defineComponent({
  components: {
    AddOne,
    Update,
  },
  setup() {
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
        dataIndex: 'classify',
      }, 

      {
        title: '操作',
        slots: {
          customRender: 'actions',
        },
      },
    ];

   
   
    const show = ref(false); //弹窗默认关闭
    const showUpdateModal = ref(false);
    const list = ref([]);    //列表数组默认空
    const total = ref(0);
    const curPage = ref(1);   //页码从1开始
    const keyword = ref('');   //搜索关键字
    const isSearch = ref(false); //判断是否在搜索状态
    const curEditBook =ref({});


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

    //编辑
    const update = ({ record }) => {
      showUpdateModal.value = true;
      curEditBook.value = record;
    };

    const updateCurBook = (newData) =>  {
      Object.assign(curEditBook.value, newData);
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
    };
  },

});