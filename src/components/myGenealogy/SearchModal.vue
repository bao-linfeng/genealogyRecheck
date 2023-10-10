<template>
    <div class="search-modal-wrap">
        <div class="head-box">
            <h3 class="search-modal-title">家谱资源</h3>
            <span class="btn" @click="isShow = !isShow">{{isShow ? '收起' : '展开'}}</span>
        </div>
        <div class="search-modal-box">
            <div class="search-input-modal">
                <input type="text" :placeholder="'谱ID'" v-model.trim="parameters['_key']" @keyup.enter="handleKeyUp" @blur="changeParameters" />
                <div class="tag_close" v-show="parameters._key" @click="clear('_key')"><i class="el-icon-close"></i></div>
            </div>
            <div class="search-input-modal">
                <input type="text" :placeholder="'谱名'" v-model.trim="parameters['genealogyName']" @keyup.enter="handleKeyUp" @blur="changeParameters" />
                <div class="tag_close" v-show="parameters.genealogyName" @click="clear('genealogyName')"><i class="el-icon-close"></i></div>
            </div>
            <div class="search-input-modal">
                <input type="text" :placeholder="'姓氏'" v-model.trim="parameters['surname']" @keyup.enter="handleKeyUp" @blur="changeParameters" />
                <div class="tag_close" v-show="parameters.surname" @click="clear('surname')"><i class="el-icon-close"></i></div>
            </div>
            <div class="search-input-modal">
                <input type="text" :placeholder="'堂号'" v-model.trim="parameters['hall']" @keyup.enter="handleKeyUp" @blur="changeParameters" />
                <div class="tag_close" v-show="parameters.hall" @click="clear('hall')"><i class="el-icon-close"></i></div>
            </div>
            <div class="search-input-modal">
                <input type="text" :placeholder="'出版年'" v-model.trim="parameters['publish']" @keyup.enter="handleKeyUp" @blur="changeParameters" />
                <div class="tag_close" v-show="parameters.publish" @click="clear('publish')"><i class="el-icon-close"></i></div>
            </div>
            <div class="search-input-modal">
                <input type="text" :placeholder="'作者'" v-model.trim="parameters['authors']" @keyup.enter="handleKeyUp" @blur="changeParameters" />
                <div class="tag_close" v-show="parameters.authors" @click="clear('authors')"><i class="el-icon-close"></i></div>
            </div>
            <div class="search-input-modal">
                <input type="text" :placeholder="'谱籍地(现代)'" v-model.trim="parameters['place']" @keyup.enter="handleKeyUp" @blur="changeParameters" />
                <div class="tag_close" v-show="parameters.place" @click="clear('place')"><i class="el-icon-close"></i></div>
            </div>
            <div class="search-input-modal" v-show="isShow">
                <input type="text" :placeholder="'谱籍地(原谱)'" v-model.trim="parameters['LocalityModern']" @keyup.enter="handleKeyUp" @blur="changeParameters" />
                <div class="tag_close" v-show="parameters.LocalityModern" @click="clear('LocalityModern')"><i class="el-icon-close"></i></div>
            </div>
            <div class="search-input-modal" v-show="isShow">
                <input type="text" :placeholder="'一世祖'" v-model.trim="parameters['firstAncestor']" @keyup.enter="handleKeyUp" @blur="changeParameters" />
                <div class="tag_close" v-show="parameters.firstAncestor" @click="clear('firstAncestor')"><i class="el-icon-close"></i></div>
            </div>
            <div class="search-input-modal" v-show="isShow">
                <input type="text" :placeholder="'始迁祖'" v-model.trim="parameters['migrationAncestor']" @keyup.enter="handleKeyUp" @blur="changeParameters" />
                <div class="tag_close" v-show="parameters.migrationAncestor" @click="clear('migrationAncestor')"><i class="el-icon-close"></i></div>
            </div>
            <div class="search-input-modal">
                <input type="text" :placeholder="'文件标题'" v-model.trim="parameters['fileName']" @keyup.enter="handleKeyUp" @blur="changeParameters" />
                <div class="tag_close" v-show="parameters.fileName" @click="clear('fileName')"><i class="el-icon-close"></i></div>
            </div>
            <div class="search-input-modal" v-show="isShow">
                <input type="text" :placeholder="'重复谱ID'" v-model.trim="parameters['Dupbookid']" @keyup.enter="handleKeyUp" @blur="changeParameters" />
                <div class="tag_close" v-show="parameters.Dupbookid" @click="clear('Dupbookid')"><i class="el-icon-close"></i></div>
            </div>
            <div class="search-input-modal" v-show="isShow">
                <input type="text" :placeholder="'谱书编号'" v-model.trim="parameters['bookId']" @keyup.enter="handleKeyUp" @blur="changeParameters" />
                <div class="tag_close" v-show="parameters.bookId" @click="clear('bookId')"><i class="el-icon-close"></i></div>
            </div>
            <el-date-picker
                v-show="isShow"
                class="w15 marginB10"
                v-model="FileTimes"
                type="daterange"
                unlink-panels
                start-placeholder="档案开始时间"
                end-placeholder="档案结束时间"
            />
            <div class="search-input-modal">
                <input type="text" :placeholder="'作者、谱籍地、始迁祖、一世祖、备注、说明'" v-model.trim="parameters['keyWord']" @keyup.enter="handleKeyUp" @blur="changeParameters" />
                <div class="tag_close" v-show="parameters.keyWord" @click="clear('keyWord')"><i class="el-icon-close"></i></div>
            </div>
            <el-select v-model="parameters.orgKey" multiple placeholder="认领机构" class="w15 marginB10">
                <el-option
                    v-for="item in orgList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="parameters.condition" multiple placeholder="谱状态" class="w15 marginB10">
                <el-option
                    v-for="item in conditionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="parameters.waitComplete" placeholder="完结状态" class="w15 marginB10">
                <el-option
                    v-for="item in waitCompleteList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <!-- <el-date-picker
                v-show="isShow"
                class="w15 marginB10"
                v-model="publishTime"
                type="monthrange"
                unlink-panels
                start-placeholder="出版年开始年"
                end-placeholder="出版年结束年"
            /> -->
            <el-select v-show="isShow" v-model="parameters.type" placeholder="类型" class="w15 marginB10">
                <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-select v-show="isShow" v-model="parameters.hasImage" placeholder="影像资料" class="w15 marginB10">
                <el-option
                    v-for="item in imageList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-select v-show="isShow" v-model="parameters.GCOver" placeholder="编目完结" class="w15 marginB10">
                <el-option
                    v-for="item in GCOverList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-select v-show="isShow" v-model="parameters.NoIndex" placeholder="索引情况" class="w15 marginB10">
                <el-option
                    v-for="item in NoIndexList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker
                v-show="isShow"
                class="w15 marginB10"
                v-model="parameters.publishStartTime"
                type="year"
                placeholder="出版年开始年">
            </el-date-picker>
            <el-date-picker
                v-show="isShow"
                class="w15 marginB10"
                v-model="parameters.publishEndTime"
                type="year"
                placeholder="出版年结束年">
            </el-date-picker>
            <!-- <div v-show="isShow" class="search-input-modal" v-for="item in 1" :key="'kon'+item"></div> -->
        </div>
        <div class="search-modal-box">
            <div class="search-input-modal"></div>
            <div class="search-button-modal" @click="getGenealogy">
                <span>搜索</span>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "searchModal",
    props:{
        fieldFilters:{
            type: Array,
        }
    },
    components: {

    },
    data: () => {
        return {
            parameters:{
                _key:'',
                place: '',
                surname: '',
                hall: '',
                publish: '',
                authors: '',
                place: '',
                LocalityModern: '',
                firstAncestor: '',
                migrationAncestor: '',
                fileName: '',
                Dupbookid: '',
                hasImage: 2,
                GCOver: '',
                NoIndex: '',
                orgKey: [],
                keyWord: '',
                condition: [],
                waitComplete: '',
                FileStartTimes: '',
                FileEndTimes: '',
                publishStartTime: '',
                publishEndTime: '',
                bookId: '',
                type: '家谱',

                // batchKey:'',
                // creator:'',
                // hasImage:2,
                libKey: '',
                equal: 1,
                createOrgKey: [],
                // begYear: '',
                // endYear: '',
                // noPublishAD: false,
                // startTime: '',
                // endTime: '',
                // isPublish: '',
                // isPlace: '',
                // FileStartTimes: '',
                // FileEndTimes: '',
                // gcStatus: '',
                // claimStartTime: '',
                // claimEndTime: '',
                // type: '家谱',
            },
            gcStatusList: [
                {'label': '全部谱书状态', 'value': ''},
                {'label': '无状态', 'value': '0'},
                {'label': '失效谱', 'value': '10'},
                {'label': '重复谱', 'value': '15'},
                {'label': '待议谱', 'value': '20'},
                {'label': '待议复审', 'value': '23'},
                {'label': '逾期谱', 'value': '25'},
                {'label': '在拍谱', 'value': '30'},
                {'label': '在拍复审', 'value': '32'},
                {'label': '开放谱书', 'value': '35'},
                {'label': '开放谱认领', 'value': '40'},
                {'label': '拍摄完结', 'value': '50'},
            ],
            typeList: [
                {'label': '全部类型', 'value': ''},
                {'label': '家谱', 'value': '家谱'},
                {'label': '方志', 'value': '方志'},
            ],
            GCOverList: [
                {'label': '编目完结', 'value': ''},
                {'label': '已完结', 'value': '1'},
                {'label': '未完结', 'value': '0'},
            ],
            batchArr: [],
            sourcelist: [],
            userList: [],
            NoIndexList: [
                {'label': '全部索引', 'value': ''},
                {'label': '可索引', 'value': 0},
                {'label': '不可索引', 'value': 1},
            ],
            waitCompleteList: [
                {'label': '完结状态', 'value': ''},
                {'label': '未认领', 'value': '3'},
                {'label': '已认领未拍摄', 'value': '4'},
                {'label': '未拍摄', 'value': '5'},
                {'label': '拍摄中', 'value': '0'},
                {'label': '待完结', 'value': '1'},
                {'label': '已完结', 'value': '2'},
            ],
            conditionList: [
                {'label': '全部谱状态', 'value': ''}, 
                {'label': 'f', 'value': 'f'}, 
                {'label': 'nf', 'value': 'nf'}, 
                {'label': 'd', 'value': 'd'}, 
                {'label': 'r', 'value': 'r'}, 
                {'label': 'm', 'value': 'm'},
                {'label': 'c', 'value': 'c'},
                {'label': 'fs', 'value': 'other'}
            ],
            imageList: [{'label':'影像资料','value':2},{'label':'有影像','value':1},{'label':'无影像','value':0}],
            libList: [],
            nolibList: [{'label':'等于','value':1},{'label':'不等于','value':0}],
            orgList: [],
            fieldFilterList: [{label:'家谱编码',value:'_key'}],
            time: '',
            FileTimes: '',
            publishTime: '',
            isShow: false,
        };
    },
    created:function(){
        // this.getBatchList();
        // this.getLib();
        this.getOrgList();
    },
    mounted:function(){
        if(this.role >= 1 && this.role <= 3){

        }else{
            this.conditionList = [
                {'label': '全部谱状态', 'value': ''}, 
                {'label': 'f', 'value': 'f'}, 
                {'label': 'nf', 'value': 'nf'}, 
                // {'label': 'd', 'value': 'd'}, 
                {'label': 'r', 'value': 'r'}, 
                {'label': 'm', 'value': 'm'},
                // {'label': 'c', 'value': 'c'},
                {'label': 'fs', 'value': 'other'}
            ];
            this.parameters.orgKey = [this.orgId];
            this.$emit('change-parameters',this.parameters);
        }
        this.initFieldFilter();
    },
    methods:{
        initFieldFilter(){
            let fieldFilterList = [];
            this.fieldFilterList.concat(this.fieldFilters).forEach((ele) => {
                if(['condition', 'volume', 'lostVolume', 'authorJob', 'hasVolume', 'genealogyGroupID'].indexOf(ele.value) > -1){
                    
                }else{
                    fieldFilterList.push(ele);
                }
            });
            this.fieldFilterList = fieldFilterList;
        },
        getOrgList:async function(){
            let data=await api.getAxios('org?siteKey='+this.stationKey+'&name=');
            if(data.status == 200){
                let orgList = []; //{'label':'全部机构','value':''}
                data.data.map((item)=>{
                    if(this.roleType == 'host'){
                        orgList.push({'label': item.organizationNo,'value': item._key});
                    }else{
                        if(this.orgId == item._key){
                            orgList.push({'label': item.organizationNo,'value': item._key});
                        }
                    }
                });
                this.orgList = orgList;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        getLib:async function(){// 来源
            let data=await api.getAxios('lib?siteKey='+this.stationKey);
            if(data.status == 200){
                let libList = [{'label':'全部来源','value':''}];
                data.data.map((item)=>{
                    libList.push({'label':item.libName,'value':item._key});
                });
                this.libList = libList;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        getBatchList:async function(){// 批次号列表
            let data=await api.getAxios('batch/simple?siteKey='+this.stationKey+'&userKey='+this.parameters.creator);
            if(data.status == 200){
                let batchArr = [{'label':'全部批次号','value':''}];
                data.data.map((item)=>{batchArr.push({'label':item.batchID,'value':item._key})});
                this.batchArr = batchArr;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        getGenealogy(){
            this.$emit('get-genealogy',this.parameters);
        },
        handleKeyUp(){
            this.$emit('get-genealogy',this.parameters);
        },
        clear(s){
            this.parameters[s] = '';
            this.$emit('change-parameters',this.parameters);
        },
        changeParameters(){
            // console.log(this.parameters);
            this.$emit('change-parameters',this.parameters);
        },
    },
    computed: {
        ...mapState({
            role: state => state.nav.role,
            stationKey: state => state.nav.stationKey,
            stationName: state => state.nav.stationName,
            stationlogo: state => state.nav.stationlogo,
            orgAdmin: state => state.nav.orgAdmin,
            orgId: state => state.nav.orgId,
            roleType: state => state.nav.roleType,
        })
    },
    watch:{
        'time': function(nv, ov){
            if(nv){
                this.parameters.startTime = new Date(nv[0]).getTime();
                this.parameters.endTime = new Date(nv[1]).getTime();
            }else{
                this.parameters.startTime = '';
                this.parameters.endTime = '';
            }
        },
        'FileTimes': function(nv, ov){
            if(nv){
                this.parameters.FileStartTimes = new Date(nv[0]).getTime();
                this.parameters.FileEndTimes = new Date(nv[1]).getTime();
            }else{
                this.parameters.FileStartTimes = '';
                this.parameters.FileEndTimes = '';
            }
        },
        'publishTime': function(nv, ov){
            if(nv){
                this.parameters.publishStartTime = new Date(nv[0]).getTime();
                this.parameters.publishEndTime = new Date(nv[1]).getTime();
            }else{
                this.parameters.publishStartTime = '';
                this.parameters.publishEndTime = '';
            }
        },
        'fieldFilters': function(nv, ov){
            this.initFieldFilter();
        },
        'orgAdmin': function(nv ,ov){
            if(this.role >= 1 && this.role <= 3){

            }else{
                this.parameters.orgKey = this.orgId;
                this.$emit('change-parameters',this.parameters);
            }
        },
        'parameters.creator':function(nl,ol){
            console.log(nl);
            this.getBatchList();
        },
        'parameters.batchKey': function(nv, ov){
            console.log(nv);
            this.$emit('change-parameters',this.parameters);
        },
        'parameters.gcStatus': function(nv, ov){
            this.$emit('change-parameters',this.parameters);
        },
        'parameters.waitComplete': function(nv, ov){
            if(nv){
                if(this.roleType == 'host'){

                }else{
                    this.parameters.orgKey = [this.orgId];
                    this.$emit('change-parameters',this.parameters);
                }
                
            }else{

            }
        },
        'parameters.orgKey': function(nv, ov){
            console.log(nv);
            
            if(this.roleType == 'host'){

            }else{
                if(nv.length){
                    
                }else{
                    // this.parameters.waitComplete = '';
                    // this.$emit('change-parameters',this.parameters);
                }
                
            }
        },
    }
};
</script>

<style scoped lang="scss">
.search-modal-wrap{
    position: relative;
    background: #fff;
    padding: 30px 20px 5px 20px;
    margin: 5px 20px;
    width: calc(100% - 80px);
    .search-modal-title{
        font-size: 16px;
        color: #344B5A;
        height: 16px;
        line-height: 16px;
        border-left: 2px solid #4C95FF;
        padding-left: 20px;
    }
    .search-modal-box{
        position: relative;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        flex-wrap:wrap;
        .simple-search-wrap{
            position: relative;
            width: 85%;
            display: flex;
            justify-content: space-between;
        }
    }
}
.head-box{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btn{
        margin-right: 20px;
        cursor: pointer;
    }
}
.search-input-modal{
    position: relative;
    width: 15%;
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    input{
        width: 100%;
        height: 38px;
        line-height: 38px;
        text-indent: 10px;
        border: none;
        outline: none;
        background: #F6FAFD;
        border: 1px solid #D6E7F3;
    }
    .tag_close{
        position: absolute;
        top: 12px;
        right: 10px;
        width: 16px;
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        text-align: center;
        color: #fff;
        background: #4C95FF;
        cursor: pointer;
    }
}
.search-button-modal{
    width: 15%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    background: #4C95FF;
    border: none;
    outline: none;
    border-radius: 20px;
    cursor: pointer;
    margin: 0;
}
.w15{
    width: 15% !important;
}
.marginB10{
    margin-bottom: 10px;
}
.noPublishAD{
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
}
</style>

