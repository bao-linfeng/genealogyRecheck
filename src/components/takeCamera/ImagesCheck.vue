<template>
    <div class="module-wrap">
        <div class="head-box">
            <h3 class="title">影像审核</h3>
        </div>
        <div class="content-box">
            <div class="detail-wrap">
                <div class="detail-box">
                    <label class="label">谱名：</label>
                    <span class="name">{{detail.genealogyName}}</span>
                </div>
                <div class="detail-box">
                    <label class="label">卷名：</label>
                    <span class="name">{{detail.volumeNumber}}</span>
                </div>
            </div>
            <div class="check-wrap" v-if="takeStatus == 5 && ['9071165330', '9071165288', '9071165268', '9071165200'].indexOf(roleKey) > -1">
                <h3 class="title">请选择您的角色(*):</h3>
                <el-radio-group v-model="user">
                    <el-radio v-for="(item, index) in userList" :label="item.value" :key="index">{{item.label}}</el-radio>
                </el-radio-group>
            </div>
            <div class="check-wrap">
                <h3 class="title">请选择更改后的状态:</h3>
                <el-radio-group v-model="operate">
                    <el-radio :class="{noMarginL: index == 2, marginT10: index >= 2}" v-for="(item, index) in operateStatusList" :label="item.value" :key="index">{{item.label}}</el-radio>
                </el-radio-group>
            </div>
            <div class="returnReason-wrap" v-if="[5, 6, 7, 12, 13, 14, 16].indexOf(detail.takeStatus) > -1">
                <h3 class="title">请输入说明<i :class="{red: ((operate == 'toVoid' || operate == 'return') && !returnReason) || (orgAdmin == 'admin' && takeStatus == 6 && operate == 'recheck') || (['9138241994'].indexOf(roleKey) > -1 && takeStatus == 6 && operate == 'recheck')}">*</i>:</h3>
                <el-input
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    v-model="returnReason">
                </el-input>
            </div>
        </div>
        <div class="foot-box">
            <el-button @click="close(false)">取消更改</el-button>
            <el-button type="primary" @click="saveData">确认更改</el-button>
        </div>
    </div>
</template>

<script>
import ADS from "../../ADS.js";
import api from "../../api.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "imageCheck",
    props:{
        detail: {
            type: Object
        },
        catalogDetail: {
            type: Object
        },
        returnReasonL: {
            type: Number
        }
    },
    data: () => {
        return {
            operateStatusList: [
                {'label': '审核通过', 'value': 'pass'}, 
                {'label': '审核不通过(打回)', 'value': 'return'},
                {'label': '待议', 'value': 'toBeDiscussed'}
            ],
            operate: 'pass',
            operateO: {
                'recheck': '提交复审',
                'pass': '审核通过',
                'return': '打回',
                'toBeDiscussed': '待议处理',
                'passDirect': '直接通过',
                'toBeDiscussedDirect': '直接待议',
                'toVoid': '作废',
            },
            returnReason: '',
            takeStatus: '',
            user: '1',
            userList: [{'label': '初审员', 'value': '1'}, {'label': '复审员', 'value': '2'}],
        };
    },
    mounted: function(){
        this.takeStatus = this.detail.takeStatus;
        if(this.roleKey == '9071165339'){
            if(this.takeStatus == 5){
                this.operateStatusList = [
                    {'label': '初审通过', 'value': 'pass'}, 
                    // {'label': '初审不通过(打回)', 'value': 'return'}
                ];
            }
            return;
        }
        if(this.orgAdmin == 'admin' || (this.role >= 1 && this.role <= 3 && (this.takeStatus == 5 || this.takeStatus == 14))){
            this.operateStatusList = [
                {'label': '审核通过', 'value': 'pass'}, 
                {'label': '审核不通过(打回)', 'value': 'return'}
            ];
        }
        if(this.role >= 1 && this.role <= 3){
            if(this.takeStatus == 5){
                this.operateStatusList = [
                    {'label': '初审通过', 'value': 'pass'}, 
                    // {'label': '初审不通过(打回)', 'value': 'return'},
                    // {'label': '作废', 'value': 'toVoid'}
                ];
            }
            if(this.takeStatus == 6){//微站 打回 => 作废、通过
                this.operateStatusList = [
                    {'label': '作废', 'value': 'toVoid'},
                    {'label': '通过', 'value': 'pass'}
                ];
            }
            if(this.takeStatus == 7){
                this.operateStatusList = [
                    {'label': '提交复审', 'value': 'recheck'}, // 2023.7.7 16:10 杨玉满 针对 已通过卷册 需要移动影像页，先提交到 复审 然后移动 在审核通过
                    {'label': '打回卷册', 'value': 'return'},
                    {'label': '作废卷册', 'value': 'toVoid'}
                ];
            }
            if(this.takeStatus == 13){
                this.operateStatusList = [
                    {'label': '复审通过', 'value': 'pass'}, 
                    {'label': '复审不通过(打回)', 'value': 'return'},
                    {'label': '复审待议', 'value': 'toBeDiscussed'},
                    {'label': '作废', 'value': 'toVoid'}
                ];
            }
            if(this.takeStatus == 14){
                this.operateStatusList = [
                    {'label': '复审通过', 'value': 'pass'}, 
                    {'label': '复审不通过(打回)', 'value': 'return'},
                    {'label': '作废', 'value': 'toVoid'}
                ];
            }
        }else if(this.orgAdmin == 'admin'){
            if(this.takeStatus == 6){// 机构 打回 => 提交复审、作废
                this.operateStatusList = [
                    {'label': '提交复审', 'value': 'recheck'}, 
                    {'label': '作废', 'value': 'toVoid'}
                ];
            }else{
                this.operateStatusList = [
                    {'label': '审核通过', 'value': 'pass'}, 
                    {'label': '审核不通过(打回)', 'value': 'return'}
                ];
            }
        }else{
            if(this.takeStatus == 6){// 机构 打回 => 提交复审、作废
                if(['9138241994'].indexOf(this.roleKey) > -1){
                    this.operateStatusList = [
                        {'label': '提交复审', 'value': 'recheck'}
                    ];
                }
            }
        }
    },
    methods:{
        close(f = false){
            this.$emit('close', f);
        },
        saveData(){
            if((this.operate == 'toVoid' || this.operate == 'return') && !this.returnReason){
                return ADS.message('请输入说明！');
            }
            if(this.orgAdmin == 'admin' && this.takeStatus == 6 && this.operate == 'recheck' && !this.returnReason){
                return ADS.message('请输入说明！');
            }
            if(['9138241994'].indexOf(this.roleKey) > -1 && this.takeStatus == 6 && this.operate == 'recheck' && !this.returnReason){
                return ADS.message('请输入说明！');
            }
            // 2023.10.24 baolf 已完结谱目，审核通过的卷册，只有 总管理员可以修改卷册状态
            if(this.takeStatus == 7 && this.catalogDetail.condition == 'f'){
                if(['9071165200'].indexOf(this.roleKey) > -1){

                }else{
                    return ADS.message('您没有权限操作！');
                }
            }
            this.$confirm('确认'+this.operateO[this.operate]+' '+this.detail.genealogyName+' '+this.detail.volumeNumber+' 的影像吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.patchTaskVerify();
            }).catch(() => {});
        },
        async patchTaskVerify(){// 卷册打回、提交审阅
            let result = await api.patchAxios('v3/review/task/verify', {'volumeKey': this.detail._key, 'operate': this.operate, 'returnReason': this.returnReason, 'siteKey': this.stationKey, 'userKey': this.userId});
            if(result.status == 200){
                if(this.operate == 'return'){
                    ADS.message('卷册已打回', true);
                    this.takeStatus = 4;
                }
                if(this.operate == 'toVoid'){
                    ADS.message('卷册已作废', true);
                    this.takeStatus = 16;
                }
                if(this.operate == 'pass'){
                    if(this.takeStatus == 12){
                        ADS.message('卷册已提交审阅', true);
                        this.takeStatus = 3;
                    }else{
                        ADS.message('卷册已审核通过', true);
                        this.takeStatus = 5;
                    }
                }
                // history.back(-1);
                this.close(true);
                // this.$router.push('/'+window.localStorage.getItem('pathname')+'/takeCamera?i='+this.takeStatus);
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
        'user': function(nv, ov){
            if(this.takeStatus == 5){
                if(nv == 1){
                    this.operateStatusList = [
                        {'label': '初审通过', 'value': 'pass'}, 
                        // {'label': '初审不通过(打回)', 'value': 'return'},
                        // {'label': '作废', 'value': 'toVoid'},
                    ];
                }
                if(nv == 2){
                    this.operateStatusList = [
                        {'label': '复审通过', 'value': 'passDirect'}, 
                        {'label': '复审不通过(打回)', 'value': 'return'},
                        {'label': '复审待议', 'value': 'toBeDiscussedDirect'},
                        {'label': '作废', 'value': 'toVoid'}
                    ];
                }
            }
        }
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

