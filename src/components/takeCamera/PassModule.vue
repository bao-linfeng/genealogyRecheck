<template>
    <div class="return-wrap">
        <p class="title">标记原因</p>
        <el-checkbox-group v-model="passReason">
            <el-checkbox v-for="(item,index) in passReasonList" :key="index" :label="item"></el-checkbox>
        </el-checkbox-group>
        <el-input
            type="textarea"
            :rows="3"
            v-model="explain"
            placeholder="说明">
        </el-input>
        <button class="btn" @click="singlePageReturn">确定</button>
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "PassModule",
    props:{
        volumeKey: String,
        imageKey: String,
        imageDetail: Object,
        submitCount: Number,
        singleKey: String,
    },
    data: () => {
        return {
            passReasonList: ['模糊', '缺页', '重复', '有异物', '不完整', '非家谱影像', '影像歪斜', '其他'],
            passReason: [],
            singlePageReturnDetail: '',
            isFirst: true,
            explain: '',
        };
    },
    mounted: function(){
        console.log(this.singleKey);
        this.getsinglePageReturnDetailNew();
    },
    methods:{
        async getSinglePageReturnDetail(){// 单页详情原因
            let result = await api.getAxios('v3/review/singlePageReturnDetail?imageKey='+this.imageKey+'&submitCount='+this.submitCount);
            if(result.status == 200){
                this.singlePageReturnDetail = result.data || '';
                if(this.singlePageReturnDetail){
                    this.passReason = this.singlePageReturnDetail.returnReason;
                    this.explain = this.singlePageReturnDetail.explain;
                }else{
                    this.passReason = [];
                    this.explain = '';
                }
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async getsinglePageReturnDetailNew(){// 单页详情原因
            console.log('---单页详情原因---','单页详情原因');
            let result = await api.getAxios('v3/review/singlePageReturnDetailNew?dataKey='+this.singleKey);
            if(result.status == 200){
                this.singlePageReturnDetail = result.data || '';
                if(this.singlePageReturnDetail){
                    this.passReason = this.singlePageReturnDetail.returnReason;
                    this.explain = this.singlePageReturnDetail.explain;
                }else{
                    this.passReason = [];
                    this.explain = '';
                }
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async singlePageReturn(){
            if(this.passReason.indexOf('其他') > -1 && !this.explain){
                return ADS.message('请填写说明');
            }
            if(this.isFirst){
                this.isFirst = false;
            }else{
                return;
            }
            
            let returnReasonKey = this.singlePageReturnDetail ? this.singlePageReturnDetail._key : '';
            let result = await api.postAxios('v3/review/singlePageReturn', 
                {
                    "volumeKey": this.volumeKey, 
                    "imageKey": this.imageDetail._key, 
                    "name": this.imageDetail.name, 
                    "index": this.imageDetail.index, 
                    "returnReason": this.passReason, 
                    "returnReasonKey": returnReasonKey,
                    'explain': this.explain,
                    'userKey': this.userId,
                } 
            , false);
            if(result.status == 200){
                this.$emit('save', '');
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
            orgId: state => state.nav.orgId,
            roleName: state => state.nav.roleName,
            roleKey: state => state.nav.roleKey,
        })
    },
    watch:{
        // 'imageKey': function(nv, ov){
        //     console.log(nv);
        //     this.passReason = [];
        //     this.getsinglePageReturnDetailNew();
        // },
        'singleKey': function(nv, ov){
            console.log(nv);
            this.passReason = [];
            this.getsinglePageReturnDetailNew();
        },
    }
};
</script>

<style scoped lang="scss">
.return-wrap{
    position: absolute;
    bottom: 40px;
    right: -80px;
    height: 405px;
    padding: 0 20px 10px 20px;
    background: #D8D8D8;
    border-radius: 5px;
    font-size: 14px;
    color: #000;
    &::before{
        content: '';
        position: absolute;
        bottom: -16px;
        left: calc(50% + 60px);
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-top: 8px solid #D8D8D8;
        border-right: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-left: 8px solid transparent;
    }
    .title{
        height: 40px;
        line-height: 40px;
    }
    .pass-input{
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-indent: 10px;
        border: none;
        outline: none;
        border-radius: 3px;
        display: block;
        margin-bottom: 10px;
    }
    .btn{
        border: none;
        outline: none;
        width: 88px;
        height: 34px;
        background: #358bcd;
        border: 1px solid #358bcd;
        border-radius: 4px;
        cursor: pointer;
        color: #fff;
        margin-top: 10px;
    }
}
.el-checkbox-group{
    text-align: left;
}
.el-checkbox+.el-checkbox{
    margin-left: 0 !important;
    display: block;
}
.el-checkbox{
    margin-bottom: 10px;
}
</style>

