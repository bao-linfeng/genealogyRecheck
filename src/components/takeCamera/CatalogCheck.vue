<template>
    <div class="module-wrap">
        <div class="head-box">
            <h3 class="title">整谱打回(初审、复审、待议卷册)</h3>
        </div>
        <div class="content-box">
            <div class="detail-wrap">
                <div class="detail-box">
                    <label class="label">谱名：</label>
                    <span class="name">{{detail.genealogyName}}</span>
                </div>
                <!-- <div class="detail-box">
                    <label class="label">卷名：</label>
                    <span class="name">{{detail.volumeNumber}}</span>
                </div> -->
            </div>
            <div class="returnReason-wrap">
                <h3 class="title">请输入说明<i class="red">*</i>:</h3>
                <el-input
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    v-model="returnReason">
                </el-input>
            </div>
        </div>
        <div class="foot-box">
            <el-button @click="close(false)">取消</el-button>
            <el-button type="primary" @click="saveData">确认</el-button>
        </div>
    </div>
</template>

<script>
import ADS from "../../ADS.js";
import api from "../../api.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "CatalogCheck",
    props:{
        detail: {
            type: Object
        },
        gcKey: String,
    },
    data: () => {
        return {
            returnReason: '',
            takeStatus: '',
        };
    },
    mounted: function(){
        this.takeStatus = this.detail.takeStatus;
    },
    methods:{
        close(f = false){
            this.$emit('close', f);
        },
        saveData(){
            if(!this.returnReason){
                return ADS.message('请输入说明！');
            }
            this.$confirm('确认整谱打回吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // this.patchTaskVerify();
            }).catch(() => {});
        },
        async patchTaskVerify(){// 卷册打回、提交审阅
            let result = await api.patchAxios('v3/review/task/verify', {'volumeKey': this.detail._key, 'operate': this.operate, 'returnReason': this.returnReason, 'siteKey': this.stationKey, 'userKey': this.userId});
            if(result.status == 200){
                
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
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
            roleName: state => state.nav.roleName,
            roleKey: state => state.nav.roleKey,
        })
    },
    watch:{

    }
};
</script>

<style scoped lang="scss">
.module-wrap{
    position: fixed;
    top: 40px;
    right: 0;
    background: #fff;
    font-size: 14px;
    color: #000;
    padding: 0 20px 20px 20px;
    width: 280px;
    .head-box{
        position: relative;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .content-box{
        text-align: left;
        margin-bottom: 20px;
        .detail-wrap{
            .detail-box{
                display: flex;
                align-items: center;
                height: 30px;
                .label{
                    width: 60px;
                }
            }
        }
        .check-wrap{
            margin: 10px 0;
            .title{
                font-weight: normal;
                height: 40px;
                line-height: 40px;
            }
        }
        .returnReason-wrap{
            .title{
                font-weight: normal;
                height: 40px;
                line-height: 40px;
            }
        }
    }
    .foot-box{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        .btn{
            width: 80px;
            height: 30px;
            outline: none;
            border: 1px solid #ddd;
            margin: 0 20px;
            cursor: pointer;
            border-radius: 3px;
            &.active{
                background: #358acd;
                color: #fff;
            }
        }
    }
}
.input{
    width: 200px;
    height: 30px;
    border: 1px solid #ddd;
    text-indent: 10px;
    text-align: left;
    outline: none;
}
.red{
    color: #f00;
    font-style: normal;
    font-weight: normal;
}
.noMarginL{
    margin-left: 0 !important;
}
.marginT10{
    margin-top: 10px !important;
}
</style>

