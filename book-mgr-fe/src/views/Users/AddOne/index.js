//添加一条时的弹窗
import { defineComponent, reactive} from 'vue';
import { user } from '@/service';
import { message } from 'ant-design-vue';
import { result, clone } from '@/helpers/utils';
import store from '@/store';

const defalutFormDate = {
    account: '',
    password: '',
    character: '',
};

export default defineComponent({
    props: {
        show: Boolean,
    },
    //把表弹窗状态的show 传回来
    setup(props, context) {
        //console.log(props);
        const { characterInfo } = store.state;
        const addForm = reactive(clone(defalutFormDate));

        addForm.character = characterInfo[1]._id;
         //关闭弹窗
         const close = () => {
            context.emit('update:show',false); //触发自定义事件
        };

        const submit = async () => {
            //复制表单拿到时间锉
            const form = clone(addForm);
           
            const res = await user.add(form.account, form.password, form.character);

            result(res)
            .success((d, { data }) => {
                Object.assign(addForm, defalutFormDate);  //重置合并表单
                message.success(data.msg);
                close();
                context.emit('getList')
            });
        };

       
        
        return {
            addForm,
            submit,
            props,
            close,
            characterInfo,
        };

    },
});