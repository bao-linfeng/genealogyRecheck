<template>
    <div class="edit-wrap" @keyup.stop="">
        <div class="head-wrap">
            <h3 class="title">{{!parameter._key ? '新增' : '编辑'}}</h3>
        </div>
        <div class="content-wrap">
            <div class="input-box">
                <label class="label" for="">父级ID:</label>
                <el-input class="width100" v-model="parameter.parentKey" placeholder="请输入父级ID" size="medium" :disabled="read" :clearable="true"></el-input>
            </div>
            <div class="input-box">
                <label class="label" for="">项目标题:</label>
                <el-input class="width100" v-model="parameter.formTitle" placeholder="请输入项目" size="medium" :disabled="read" :clearable="true"></el-input>
            </div>
            <div class="input-box">
                <label class="label" for="">标题:</label>
                <el-input class="width100" v-model="parameter.menuTitle" placeholder="请输入标题" size="medium" :disabled="read" :clearable="true"></el-input>
            </div>
            <div class="input-box">
                <label class="label" for="">路由:</label>
                <el-input class="width100" v-model="parameter.route" placeholder="请输入路由" size="medium" :disabled="read" :clearable="true"></el-input>
            </div>
            <div class="input-box">
                <label class="label" for="">图标:</label>
                <el-input class="width100" v-model="parameter.icon" placeholder="请输入图标" size="medium" :disabled="read" :clearable="true"></el-input>
            </div>
            <div class="input-box">
                <label class="label" for="">Level:</label>
                <el-input class="width100" v-model="parameter.level" placeholder="请输入Level" size="medium" :disabled="read" :clearable="true"></el-input>
            </div>
        </div>
        <div class="foot-wrap">
            <el-button size="medium" @click="close">取消</el-button>
            <el-button type="primary" size="medium" @click="save">确定</el-button>
        </div>
    </div>
</template>

<script>
import ADS from "../../ADS.js";
import api from "../../api.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "editModule",
    props:{
        detail: {
            type: Object
        },
        read: Boolean,
    },
    data: () => {
        return {
            parameter: {'_key': '', 'menuTitle': '', 'formTitle': '', 'route': '', 'icon': '', 'level': '', 'parentKey': ''},
        };
    },
    mounted: function(){
        this.parameter = {
            '_key': this.detail._key || '', 
            'menuTitle': this.detail.menuTitle || '', 
            'formTitle': this.detail.formTitle || '',
            'route': this.detail.route || '', 
            'icon': this.detail.icon || '', 
            'level': this.detail.level || '0',
            'parentKey': this.detail.parentKey || ''
        };
    },
    methods:{
        close(){
            this.$emit('close', false);
        },
        save(){
            if(this.parameter._key){
                this.editFn();
            }else{
                this.addFn();
            }
        },
        async addFn(){
            let result = await api.postAxios('menu', {
                "route": this.parameter.route, 
                "menuTitle": this.parameter.menuTitle, 
                "formTitle": this.parameter.formTitle, 
                "icon": this.parameter.icon, 
                "level": this.parameter.level, 
                "parentKey": this.parameter.parentKey,
            });
            if(result.status == 200){
                ADS.message('新增成功！', true);
                this.close();
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async editFn(){
            let result = await api.patchAxios('menu', {
                "menuKey": this.detail._key,
                "patchData": {
                    "route": this.parameter.route, 
                    "menuTitle": this.parameter.menuTitle, 
                    "formTitle": this.parameter.formTitle, 
                    "icon": this.parameter.icon, 
                    "level": this.parameter.level, 
                    "parentKey": this.parameter.parentKey,
                }
            });
            if(result.status == 200){
                ADS.message('编辑成功！', true);
                this.close();
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        }
    },
    computed: {
        ...mapState({
            TOKEN: state => state.nav.TOKEN,
            userName: state => state.nav.userName,
            userId: state => state.nav.userId,
            stationKey: state => state.nav.stationKey,
            role: state => state.nav.role,
            pathname: state => state.nav.pathname,
            orgAdmin: state => state.nav.orgAdmin,
        })
    },
    watch:{
        'parameter': function(nv, ov){
            console.log(nv);
        },
    }
};
</script>

<style scoped lang="scss">
.edit-wrap{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border: 1px solid #ddd;
    font-size: 14px;
    color: #000;
    padding: 20px;
    border-radius: 5px;
    z-index: 10;
    .head-wrap{
        position: relative;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .content-wrap{
        position: relative;
        margin: 10px 0;
        .input-box{
            display: flex;
            align-items: center;
            text-align: left;
            margin-bottom: 10px;
            .label{
                display: block;
                width: 100px;
                height: 40px;
                line-height: 40px;
            }
        }
    }
    .foot-wrap{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
    }
}
</style>

