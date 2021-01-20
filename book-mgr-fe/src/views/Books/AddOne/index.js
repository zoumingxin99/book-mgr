//添加一条时的弹窗
import { defineComponent, reactive} from 'vue';
import { book } from '@/service';
import { message } from 'ant-design-vue';
import { result, clone } from '@/helpers/utils';

const defalutFormDate = {
    name: '',
    price: 0,
    author: '',
    publishDate: 0,
    classify: '',
    count:'',
};

export default defineComponent({
    props: {
        show: Boolean,
    },
    //把表弹窗状态的show 传回来
    setup(props, context) {
        //console.log(props);
        const addForm = reactive(clone(defalutFormDate));

        const submit = async () => {
            //复制表单拿到时间锉
            const form = clone(addForm);
            form.publishDate = addForm.publishDate.valueOf();
            const res = await book.add(form);

            result(res)
            .success((d, { data }) => {
                Object.assign(addForm, defalutFormDate);  //重置合并表单
                message.success(data.msg);

            });
        };

        //关闭弹窗
        const close = () => {
            context.emit('update:show',false); //触发自定义事件
        };
        
        return {
            addForm,
            submit,
            props,
            close,
        };

    },
});