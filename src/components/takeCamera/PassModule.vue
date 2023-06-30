<template>
    <div class="return-wrap">
        <p class="title">标记原因</p>
        <el-checkbox-group v-model="passReason">
            <el-checkbox v-for="(item,index) in passReasonList" :key="index" :label="item"></el-checkbox>
        </el-checkbox-group>
        <input class="pass-input" type="text" v-model="reason" placeholder="自定义标记原因" />
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
        passReasonA: {
            type: Array
        },
        volumeKey: String,
        imageKey: String,
        imageDetail: Object,
        submitCount: Number,
    },
    data: () => {
        return {
            passReasonList: ['模糊', '缺页', '重复', '有异物', '不完整', '非家谱影像', '影像歪斜'],
            passReason: [],
            reason: '',
            singlePageReturnO: '',
            isFirst: true,
        };
    },
    mounted: function(){
        // if(this.passReasonA.length == 1 && this.passReasonList.indexOf(this.passReasonA[0]) === -1){
        //     this.reason = this.passReasonA[0];
        //     this.passReason = [];
        // }else{
        //     this.reason = '';
        //     this.passReason = this.passReasonA;
        // }

        this.getSinglePageReturnDetail();
    },
    methods:{
        setPassReason(){
            if(this.reason){
                this.$emit('set-reason', this.reason);
                this.reason = '';
            }else{
                if(this.passReason.length){
                    this.$emit('set-reason', this.passReason.join());
                    this.passReason = [];
                }else{
                    this.$emit('set-reason', '');
                    this.passReason = [];
                    // this.$XModal.message({message: '请勾选打回原因', status: 'warning'});
                }
            }
        },
        async getSinglePageReturnDetail(){// 单页详情原因
            let result = await api.getAxios('v3/review/singlePageReturnDetail?imageKey='+this.imageKey+'&submitCount='+this.submitCount);
            if(result.status == 200){
                this.singlePageReturnO = result.data || '';
                if(this.singlePageReturnO){
                    if(this.singlePageReturnO.returnReason.length == 1 && this.passReasonList.indexOf(this.singlePageReturnO.returnReason[0]) === -1){
                        this.reason = this.singlePageReturnO.returnReason;
                        this.passReason = [];
                    }else{
                        this.reason = '';
                        this.passReason = this.singlePageReturnO.returnReason;
                    }
                }
            }else{
                this.$XModal.message({message: result.msg, status: 'warning'})
            }
        },
        async singlePageReturn(){
            if(this.isFirst){
                this.isFirst = false;
            }else{
                return;
            }
            
            let returnReason = [], returnReasonKey = this.singlePageReturnO ? this.singlePageReturnO._key : '';
            if(this.reason){
                returnReason = [this.reason];
            }else{
                returnReason = this.passReason;
            }
            let result = await api.postAxios('v3/review/singlePageReturn', 
                {
                    "volumeKey": this.volumeKey, 
                    "imageKey": this.imageDetail._key, 
                    "name": this.imageDetail.name, 
                    "index": this.imageDetail.index, 
                    "returnReason": returnReason, 
                    "returnReasonKey": returnReasonKey,
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
        'passReasonA': function(nv,ov){
            // if(nv.length == 1 && this.passReasonList.indexOf(nv[0]) === -1){
            //     this.reason = nv[0];
            //     this.passReason = [];
            // }else{
            //     this.reason = '';
            //     this.passReason = nv;
            // }
        },
        'imageKey': function(nv, ov){
            console.log(nv);
            this.reason = '';
            this.passReason = [];
            this.getSinglePageReturnDetail();
        },
    }
};
</script>

<style scoped lang="scss">
.return-wrap{
    position: absolute;
    bottom: 40px;
    right: -80px;
    height: 330px;
    padding: 0 20px 10px 20px;
    background: #D8D8D8;
    border-radius: 5px;
    font-size: 14px;
    color: #000;
    &::before{
        content: '';
        position: absolute;
        bottom: -16px;
        left: 50%;
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

