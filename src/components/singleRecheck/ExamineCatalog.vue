<template>
    <DragModule class="w400">
        <div class="examine-wrap">
            <div class="head-box">
                <h3 class="title">编目待议审核</h3>
                <img class="close" @click="close(false)" src="../../assets/close.svg" alt="">
            </div>
            <div class="content-box" @mousedown.stop="">
                <h3 class="title">{{detail.genealogyName}}({{dataKey}})</h3>
                <div class="box" v-if="roleType == 'host' && '9071165200' != roleKey">
                    <p class="title">重复标记</p>
                    <el-radio-group v-model="isDuplicate">
                        <el-radio :label="0">确认不重复</el-radio>
                        <el-radio :label="1">确认重复</el-radio>
                    </el-radio-group>
                </div>
                <div class="box" v-if="roleType == 'host'">
                    <!-- <i class="red">*</i> -->
                    <p class="title">谱状态更新</p>
                    <el-select v-model="condition" placeholder="谱目状态" size="small" :disabled="'9071165200' != roleKey">
                        <el-option
                            v-for="item in conditionList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="box" v-if="roleType == 'host'">
                    <p class="title">重复谱ID</p>
                    <el-input
                        placeholder="重复谱ID"
                        v-model="Dupbookid"
                        :disabled="'9071165200' == roleKey">
                    </el-input>
                </div>
                <div class="box" v-if="roleType == 'host'">
                    <p class="title">说明</p>
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="此处填写谱状态更改说明信息"
                        v-model="explain">
                    </el-input>
                    <!-- :disabled="'9071165200' == roleKey" -->
                </div>
                <!-- <div class="box" v-if="roleType == 'host' && '9071165200' == roleKey">
                    <p class="title">确认处理</p>
                    <el-switch v-model="isDeduction" />
                </div> -->
            </div>
            <div class="foot-box" @mousedown.stop="">
                <el-button type="primary" size="medium" @click="save">保存</el-button>
            </div>
        </div>
    </DragModule>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import DragModule from '../../components/dragModule/DragModule.vue';
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "examineCatalog",
    props:{
        dataKey:{
            type: String
        },
        checkTaskKey: String,
    },
    components: {
        DragModule, 
    },
    data: () => {
        return {
            conditionList: [
                // {'label': 'f|完结', 'value': 'f'}, 
                {'label': 'nf|可拍', 'value': 'nf'}, 
                {'label': 'm|待议', 'value': 'm'}, 
                {'label': 'd|重复', 'value': 'd'}, 
                {'label': 'r|无效', 'value': 'r'},
                // {'label': 'c|作废', 'value': 'c'}
            ],
            condition: '',
            explain: '',
            detail: {},
            Dupbookid: '',
            isDuplicate: 1,
            isDeduction: false,
        };
    },
    mounted:function(){
        this.getDataDetail();
    },
    methods:{
        close(f){
            this.$emit('close', f);
        },
        async getDataDetail(){
            const result = await api.getAxios('catalog/detail?catalogKey='+this.dataKey);
            if(result.status == 200){
                this.detail = result.data;
                this.condition = this.detail.condition || '';
                this.Dupbookid = result.data.Dupbookid;
                this.explain = result.data.explain;
                this.isDeduction = result.data.isDeduction == 1 ? true : false;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        async verifyToBeDiscussedGC(){// 编目（谱目）待议审核
            let result = await api.patchAxios('data/verifyToBeDiscussedGC', {
                'siteKey': this.stationKey, 
                'userKey': this.userId,
                'checkTaskKey': this.checkTaskKey,
                'condition': this.condition,
                'explain': this.explain,
            });
            if(result.status == 200){
                ADS.message('编目待议审核成功！', true);
                this.close(true);
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async isDuplicateGC(){// 是否重复谱确认 isDuplicate 重复 1 是 0 否 baolf 2023.09.05 13:55
            let result = await api.postAxios('data/isDuplicateGC', {
                'checkTaskKey': this.checkTaskKey,
                'isDuplicate': this.isDuplicate,
                'userKey': this.userId, 
                'siteKey': this.stationKey,
                'Dupbookid': this.Dupbookid,
                'explain': this.explain,
            });

            if(result.status == 200){
                ADS.message('编目待议审核成功！', true);
                this.close(true);
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' });
            }
        },
        save(){
            if(['9071165200'].indexOf(this.roleKey) > -1){
                this.verifyToBeDiscussedGC();
            }else{
                if(this.isDuplicate == 1 && !this.Dupbookid){
                    return ADS.message('重复谱目，必填 重复谱ID');
                }
                if(this.isDuplicate == 1 && !this.explain){
                    return ADS.message('重复谱目，必填 说明！');
                }
                this.isDuplicateGC();
            }
        },
    },
    computed: {
        ...mapState({
            stationKey: state => state.nav.stationKey,
            stationName: state => state.nav.stationName,
            stationlogo: state => state.nav.stationlogo,
            userId: state => state.nav.userId,
            roleType: state => state.nav.roleType,
            roleKey: state => state.nav.roleKey,
        })
    },
};
</script>

<style scoped lang="scss">
.w400{
    height: auto !important;
    width: 100px !important;
}
.examine-wrap{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 50px;
    min-width: 300px;
    background: #fff;
    box-shadow: 0 1px 4px #ddd;
    z-index: 100;
    .head-box{
        position: relative;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .close{
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            cursor: pointer;
        }
    }
}
.content-box{
    position: relative;
    .title{
        height: 40px;
        line-height: 40px;
        .red{
            color: #f00;
        }
    }
}
.foot-box{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
}
.width200{
    width: 200px;
}
.marginL10{
    margin-right: 10px;
}
.examine-drag{
    width: 400px;
    height: 500px;
}
</style>

