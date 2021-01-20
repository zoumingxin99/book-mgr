//添加一条时的弹窗
import { defineComponent, reactive, watch} from 'vue';
import { book } from '@/service';
import { message } from 'ant-design-vue';
import { result, clone } from '@/helpers/utils';
import moment from 'moment';

export default defineComponent({
    props: {
        show: Boolean,
        book: Object,
    },
    //把表弹窗状态的show 传回来
    setup(props, context) {
        const editForm = reactive({
            name: '',
            price: 0,
            author: '',
            publishDate: 0,
            classify: '',
            count:'',
        });
        //关闭弹窗
        const close = () => {
            context.emit('update:show',false); //触发自定义事件
        };

        watch (() => props.book, (current) => {
            Object.assign(editForm, current);
            editForm.publishDate = moment(Number(editForm.publishDate));
        });

        const submit = async () => {
            const res = await book.update({
                id: props.book._id,
                name: editForm.name,
                price: editForm.price,
                author: editForm.author,
                publishDate: editForm.publishDate.valueOf(),
                classify: editForm.classify,
            });

            result(res)
                .success(({ data, msg }) => {
                  context.emit('update',data);
                  message.success(msg);
                  close();
                });
        };
        
        return {
            editForm,
            submit,
            props,
            close,
        };

    },
});