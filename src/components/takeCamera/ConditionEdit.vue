<template>
    <div class="condition-wrap" @keyup.stop="">
        <div class="head-box">
            <h3 class="title">{{catalog.genealogyName}}-编辑谱目状态</h3>
            <img class="close" @click="close" src="../../assets/close.svg" alt="">
        </div>
        <div class="content-box">
            <div class="condition-box">
                <label class="label">谱目状态</label>
                <el-select class="w200" v-model="condition" size="mini" placeholder="状态">
                    <el-option
                        v-for="item in conditionList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="condition-box" @mousedown.stop="">
                <label class="label">修改原因</label>
                <el-input
                    class="w200"
                    type="textarea"
                    :rows="3"
                    v-model="reason">
                </el-input>
            </div>
        </div>
        <div class="foot-box">
            <el-button size="mini" @click="close">取消</el-button>
            <el-button type="primary" size="mini" @click="saveData">保存</el-button>
        </div>
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "conditionEdit",
    props:{
        catalog: Object,
    },
    data: () => {
        return {
            conditionList: [
                {'label': 'f', 'value': 'f'},
                {'label': 'nf', 'value': 'nf'},
                {'label': 'm', 'value': 'm'},
                {'label': 'r', 'value': 'r'},
                {'label': 'd', 'value': 'd'},
                // {'label': 'c', 'value': 'c'},
            ],
            condition: '',
            reason: '',
        };
    },
    mounted: function(){
        this.condition = this.catalog.condition || '';
    },
    methods:{
        close(){
            this.$emit('close', false);
        },
        saveData(){
            if(this.catalog.condition == this.condition){
                // return ADS.message('相同谱目状态不建议修改！');
            }
            if(this.catalog.indexAssign === '已分配' && this.catalog.condition === 'f' && this.condition != 'f'){
                this.$confirm('此谱已分配给索引供应商，请确认是否变更谱状态？', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning',
                }).then(() => {
                    this.updateCondition();
                }).catch((e) => {
                    console.log(e);
                });
            }else{
                this.updateCondition();
            }
        },
        async updateCondition(){// 编辑谱目状态
            let data = await api.patchAxios('v3/review/updateCondition',{
                'gcKey': this.catalog._key, 
                'condition': this.condition,
                'reason': this.reason,
                'userKey': this.userId, 
                'siteKey': this.stationKey,
            });

            if(data.status == 200){
                this.$emit('save', this.condition);
            }else{
                ADS.message(data.msg);
            }
        },
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
        
    }
};
</script>

<style scoped lang="scss">
.condition-wrap{
    position: fixed;
    top: 40px;
    right: 450px;
    background: #fff;
    font-size: 14px;
    color: #000;
    box-shadow: 0 0 1px 1px #ddd;
    z-index: 1000;
    padding: 10px 20px;
    .head-box{
        position: relative;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        .close{
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            cursor: pointer;
        }
    }
    .content-box{
        position: relative;
        width: 100%;
    }
    .foot-box{
        position: relative;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.condition-box{
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .label{
        text-align: right;
        margin-right: 10px;
        width: 100px;
    }
}
.w200{
    width: 200px;
}
</style>

