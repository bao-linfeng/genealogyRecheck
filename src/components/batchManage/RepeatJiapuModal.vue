<template>  
    <div class="section-box">
        <div class="section-box-tab">
            <span :class="tabIndex == index ? 'active' : ''" v-for="(item,index) in ['重复可疑数据','附近相关数据']" :key="'tab'+index" @click="tabIndex = index">{{item}}{{index == 2 ? '' : ('('+(index == 1 ? nearAllData.length : dubiousData.length)+')')}}</span>
            <span>{{row && row.genealogyName}}  {{row.prov}}{{row.city}}{{row.district}}</span>
        </div>
        <div class="table-wrap" v-if="isDataRepeat" v-show="tabIndex === 0">
            <el-table
                :data="dubiousData"
                :height="h*0.4"
                border
                style="width: 100%">
                <el-table-column fixed="left" prop="rules" label="命中规则与风险" width="140" align="center"></el-table-column>
                <el-table-column fixed="left" v-for="(item,index) in field_main" :prop="item.fieldName" :label="item.fieldMeans" :key="'main'+index" width="100" align="center"></el-table-column>
                <el-table-column v-for="(item,index) in field_branch" :prop="item.fieldName" :label="item.fieldMeans" :key="'branch'+index" width="100" align="center"></el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="150"
                    align="center">
                    <template slot-scope="scope">
                        <button class="AdaiActionButton" v-if="scope.row.imageLink || scope.row.imageOriginal == 'pipeline'" @click="readBook(scope.row)">影像</button>
                        <button class="AdaiActionButton" v-if="!scope.row.imageLink && scope.row.imageOriginal != 'pipeline' && (scope.row.hasFileOrRemark || scope.row.remark || scope.row.needFillFields)" @click="showAnnex(scope.row)">附件</button>
                        <button class="AdaiActionButton disabled" v-if="!scope.row.imageLink && scope.row.imageOriginal != 'pipeline' && !scope.row.hasFileOrRemark && !scope.row.remark && !scope.row.needFillFields">影像</button>
                        <button class="AdaiActionButton" @click="repeatMark(scope.row)">标记</button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div :class="'table-wrap'+ (isF ? '' : ' place-wrap')" v-if="tabIndex === 1">
            <el-table
                :data="nearData"
                :height="isF ? h*0.4 : h2"
                border
                style="width: 100%">
                <el-table-column fixed="left" prop="distance" label="距离(km)" width="100" align="center"></el-table-column>
                <el-table-column fixed="left" v-for="(item,index) in field_main" :prop="item.fieldName" :label="item.fieldMeans" :key="'main'+index" width="100" align="center"></el-table-column>
                <el-table-column v-for="(item,index) in field_branch" :prop="item.fieldName" :label="item.fieldMeans" :key="'near'+index" width="100" align="center"></el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="150"
                    align="center">
                    <template slot-scope="scope">
                        <button class="AdaiActionButton" v-if="scope.row.imageLink || scope.row.imageOriginal == 'pipeline'" @click="readBook(scope.row)">影像</button>
                        <button class="AdaiActionButton" v-if="!scope.row.imageLink && scope.row.imageOriginal != 'pipeline' && (scope.row.hasFileOrRemark || scope.row.remark || scope.row.needFillFields)" @click="showAnnex(scope.row)">附件</button>
                        <button class="AdaiActionButton disabled" v-if="!scope.row.imageLink && scope.row.imageOriginal != 'pipeline' && !scope.row.hasFileOrRemark && !scope.row.remark && !scope.row.needFillFields">影像</button>
                    </template>
                </el-table-column>
            </el-table>
            <button class="more" @click="getMore" v-if="!isMore">更多</button>
        </div>
        <!-- <div class="single-search" :style="{height: h*0.4+'px'}" v-if="tabIndex === 2">
            <SearchModal :fieldFilters="fieldFilters" v-on:get-genealogy="getGenealogy" />
            <GenealogyTableModal v-if="fieldFilters.length" :isShow="true" :fieldFilters="fieldFilters" :total="total" :list="list" v-on:checkbox-change="checkboxChange" v-on:get-genealogy="getJiapuList" />
            <vxe-pager
                align="center"
                @page-change = "changePage"
                :current-page.sync="page"
                :page-size.sync="limit"
                :total="total"
                :layouts="['PrevJump', 'PrevPage', 'JumpNumber','NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']">
            </vxe-pager>
        </div> -->
        <Loading v-show="loading" />
        <div class="loading2" v-show="loading2">
            <span>附近数据加载中</span>
        </div>
        <!-- 附件 -->
        <AnnexModal v-if="isShowAnnex" :gid="gid" :row="annexRow" v-on:close-annex="isShowAnnex = false" />
    </div>
</template>

<script>
import SearchModal from "../myGenealogy/SearchModal.vue";
import GenealogyTableModal from "../myGenealogy/GenealogyTableModal.vue";
import AnnexModal from "../QingTimeGenealogy/AnnexModal.vue";
import api from "../../api.js";
import ADS from "../../ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    components: {
        SearchModal,GenealogyTableModal, AnnexModal,
    },
    name: "RepeatJiapuModal",
    props:{
        h:{
            type: Number
        },
        row:{
            type: Object
        },
        pumuThead: {
            type: Array
        },
        active: {
            type: Number
        },
        isF:{
            type: Boolean,
            default: false
        },
    },
    data: () => {
        return {
            tabIndex: 0,
            nearData: [],
            nearDataField: [],
            nearAllData: [],
            dubiousData: [],
            h2: 1080,
            isMore: false,
            collapsable: true,
            repeatDetailFieldO: [],
            repeatDetailField: [],

            keyWordObj: '',
            libKey: '',
            equal: 1,
            orgKey: '',
            begYear: '',
            endYear: '',
            noPublishAD: '',
            prop: '',
            order: '',
            page: 1,
            limit: 20,
            list:[],
            total:0,
            fieldFilters:[],
            loading: false,
            loading2: false,
            checkList: [],
            startTime: '',
            endTime: '',
            fileName: '',
            isPublish: '',
            isPlace: '',
            condition: '',
            isDataRepeat: true,
            field_main: [],
            field_branch: [],
            isShowAnnex: false,
            annexRow: {},
            gid: '',
        };
    },
    created:function(){
        this.field_main = [
            {'fieldMeans': '谱ID', 'fieldName': '_key'},
            {'fieldMeans': '谱名', 'fieldName': 'genealogyName'},
        ];

        this.field_branch = [
            {'fieldMeans': '姓氏', 'fieldName': 'surname'},
            {'fieldMeans': '出版年', 'fieldName': 'publish'},
            {'fieldMeans': '堂号', 'fieldName': 'hall'},
            {'fieldMeans': '一世祖', 'fieldName': 'firstAncestor'},
            {'fieldMeans': '始迁祖', 'fieldName': 'migrationAncestor'},
            {'fieldMeans': '谱籍地(现代)', 'fieldName': 'place'},
            {'fieldMeans': '谱籍地(原谱)', 'fieldName': 'LocalityModern'},
            {'fieldMeans': '总卷数', 'fieldName': 'volume'},
            {'fieldMeans': '缺卷说明', 'fieldName': 'lostVolume'},
            {'fieldMeans': '可拍册数', 'fieldName': 'hasVolume'},
            {'fieldMeans': '作者', 'fieldName': 'authors'},
            {'fieldMeans': '作者职务', 'fieldName': 'authorJob'},
            {'fieldMeans': '版本类型', 'fieldName': 'version'},
            {'fieldMeans': '起始年', 'fieldName': 'startYear'},
            {'fieldMeans': '备注', 'fieldName': 'memo'},
            {'fieldMeans': '说明', 'fieldName': 'explain'},
            {'fieldMeans': '谱状态', 'fieldName': 'condition'},
            {'fieldMeans': '供应商代号', 'fieldName': ''},
            {'fieldMeans': '档案时间', 'fieldName': 'Filetimes'},
            {'fieldMeans': '档案名称', 'fieldName': 'Filenames'},
            {'fieldMeans': '姓氏2', 'fieldName': 'surname2'},
            {'fieldMeans': '姓氏3', 'fieldName': 'surname3'},
            {'fieldMeans': '谱书编号', 'fieldName': 'bookId'},
            {'fieldMeans': 'DGS号码', 'fieldName': 'DGS'},
            {'fieldMeans': '微卷编号', 'fieldName': 'film'},
            {'fieldMeans': '家谱群组ID', 'fieldName': 'genealogyGroupID'},
            {'fieldMeans': '项目ID', 'fieldName': 'Projectid'},
            {'fieldMeans': '拍摄日期', 'fieldName': 'capturedate'},
            {'fieldMeans': 'Media号', 'fieldName': 'Media'},
        ];
    },
    mounted:function(){
        this.h2 =  window.innerHeight - 40;
        // this.getFieldFilterList();

        let nearDataField = [],repeatDetailField = [],repeatDetailFieldO = [];
        this.pumuThead.forEach((ele) => {
            if(ele.fieldName === 'genealogyName'){
                
            }else{
                nearDataField.push(ele);
            }
        });

        // 重复可以数据表头
        repeatDetailField = [
        {'fieldName': 'surname', 'fieldMeans': '姓氏'},
        {'fieldName': 'authors', 'fieldMeans': '作者'},
        {'fieldName': 'volume', 'fieldMeans': '卷(册)说明'},
        {'fieldName': 'hall', 'fieldMeans': '堂号'},
        {'fieldName': 'missVolumeSupplement', 'fieldMeans': '缺卷补充'},
        {'fieldName': 'lostVolume', 'fieldMeans': '缺卷(册)说明'},
        {'fieldName': 'hasVolume', 'fieldMeans': '应拍卷(册)数'},
        {'fieldName': 'LocalityModern', 'fieldMeans': '谱籍现代地名'},
        {'fieldName': 'prov', 'fieldMeans': '省'},
        {'fieldName': 'city', 'fieldMeans': '市'},
        {'fieldName': 'district', 'fieldMeans': '区'},
        {'fieldName': 'bookId', 'fieldMeans': '谱书编号'},
        {'fieldName': 'DGS', 'fieldMeans': 'DGS 号码'},
        {'fieldName': 'film', 'fieldMeans': '微卷编号'},
        {'fieldName': 'genealogyGroupID', 'fieldMeans': '家谱群组ID'},
        {'fieldName': 'Projectid', 'fieldMeans': '项目ID'},
        {'fieldName': 'capturedate', 'fieldMeans': '拍摄日期'},
        {'fieldName': 'Media', 'fieldMeans': 'Media号'},
        {'fieldName': 'memo', 'fieldMeans': '备注'},
        {'fieldName': 'Dupbookid', 'fieldMeans': '重复谱书编号'},
        {'fieldName': 'Filetimes', 'fieldMeans': '档案时间'},
        {'fieldName': 'Filenames', 'fieldMeans': '档名'},
        {'fieldName': 'code', 'fieldMeans': '代号'},
        {'fieldName': 'VolumeFst', 'fieldMeans': '序号'},
        {'fieldName': 'condition', 'fieldMeans': '状态'},
        {'fieldName': 'explain', 'fieldMeans': '说明'}
        ];
        
        this.nearDataField = nearDataField;
        this.repeatDetailFieldO = repeatDetailFieldO;
        this.repeatDetailField = repeatDetailField;
    },
    methods:{
        showAnnex(row){
            this.annexRow = row;
            this.gid = row._key;
            this.isShowAnnex = true;
        },
        cellClickEvent({row,column}){
            if(column.property == 'toggle'){
                this.collapsable = !this.collapsable;
                const xTable = this.$refs.xTable6;
                xTable.refreshColumn();
            }
        },
        getFieldFilterList:async function(){// 检索字段列表
            let data = await api.getAxios('field/filter?type=家谱&asSearch=1');
            if(data.status == 200){
                let fieldFilters = [];
                data.data.map((item)=>{fieldFilters.push({'label':item.fieldMeans,'value':item.fieldName})});
                this.fieldFilters = fieldFilters;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        changePage({currentPage}){// 页码切换回调
            this.page = currentPage;
            this.getJiapuList();
        },
        getGenealogy(data){// 检索家谱
            let keyWordObj = {};
            this.libKey = data['libKey'];
            this.equal = data['equal'];
            this.orgKey = data['orgKey'];
            this.begYear = data['begYear'] || '';
            this.endYear = data['endYear'] || '';
            this.noPublishAD = data['noPublishAD'] ? 1 : '';
            this.startTime = data['startTime'] || '';
            this.endTime = data['endTime'] || '';
            this.fileName = data['fileName'] || '';
            this.isPublish = data['isPublish'] ? 1 : '';
            this.isPlace = data['isPlace'] ? 1 : '';
            this.condition = data['condition'] || '';
            for(let key in data){
                if(key == 'condition' || key == 'isPublish' || key == 'isPlace' || key == 'fileName' || key == 'startTime' || key == 'endTime' || key == 'libKey' || key == 'equal' || key == 'orgKey' || key == 'begYear' || key == 'endYear' || key == 'noPublishAD'){

                }else{
                    keyWordObj[key] = data[key];
                }
            }
            this.keyWordObj = keyWordObj;
            this.getJiapuList();
        },
        getJiapuList:async function(){// 谱目列表
            this.loading = true;
            let data = await api.getAxios('catalog/back?siteKey='+this.stationKey+'&startFileTimes=&endFileTimes='+'&condition='+this.condition+'&isPublish='+this.isPublish+'&isPlace='+this.isPlace+'&noPublishAD='+this.noPublishAD+'&fileName='+this.fileName+'&startTime='+this.startTime+'&endTime='+this.endTime+'&begYear='+this.begYear+'&endYear='+this.endYear+'&libKey='+this.libKey+'&orgKey='+this.orgKey+'&equal='+this.equal+'&keyWordObj='+JSON.stringify(this.keyWordObj)+'&prop='+this.prop+'&order='+this.order+'&page='+this.page+'&limit='+this.limit);
            this.loading = false;
            if(data.status == 200){
                this.list = data.result.list;
                this.list.map((item)=>{
                    item.address = (item.prov || '') + ' ' + (item.city || '') + ' ' + (item.district || '');
                    item.hasImage = item.hasImage == 1 ? '有' : '无';
                    item.libsStr = item.libs.join(',');
                });
                this.total = data.result.total;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        checkboxChange(data){// 复选框切换回调
            console.log(data);
            this.checkList = data;
        },
        readBook(row){// 阅读影像
            if(row.imageLink){
                window.open(row.imageLink);
            }else if(row.imageOriginal == 'pipeline'){
                window.open('/'+this.pathname+'/viewImage?gid='+row._key+'&genealogyName='+row.genealogyName);
                // window.open('/'+this.pathname+'/cameraImage?device='+row.device+'&vid='+row.volumeKey+'&gid='+row._key+'&genealogyName='+row.genealogyName);
            }else{
                this.$XModal.message({ message: '暂无无法查看影像', status: 'warning' });
            }
        },
        activeCellMethod({row,column}){//控制编辑
            if(this.active != 3 || !row._key){
                return false;
            }
            return true;
        },
        changeLoading(flag = true){
            this.$store.dispatch('setPropertyValue',{'property':'loading','value': flag});
        },
        repeatMark(row){// 标记重复家谱
            this.$confirm('此操作将标记家谱来源, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.repeatMarkApi(row);
            }).catch(() => {});
            
        },
        async repeatMarkApi(row){// 标记重复家谱
            let dubiousData = [];
            this.changeLoading();
            let data = await api.patchAxios('data/repeatMark',{'originKey':this.row._key,'repeatKey':row._key});
            this.changeLoading(false);
            if(data.status == 200){
                this.dubiousData.map((item)=>{
                    item.repeatMark = item._key == row._key ? 1 : 0;
                    dubiousData.push(item);
                });
                this.dubiousData = dubiousData;
                this.$XModal.message({ message: '标记成功', status: 'success' });
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        getDataRepeatDetail:async function(dataKey){// 重复可疑数据
            this.isDataRepeat = false;
            this.changeLoading();
            let data=await api.getAxios('data/repeatDetail?dataKey='+dataKey);
            this.changeLoading(false);
            this.isDataRepeat = true;
            if(data.status == 200){
                let dubiousData = data.data;
                dubiousData.map((item)=>{
                    item.toggle = '>';
                    if(item.rule && item.rule.length){
                        let rule = item.rule,rules='';
                        rule.map((item2)=>{
                            rules = rules + item2.rule+'('+item2.repeatPercent+'%)  ';
                        });
                        item.rules = rules;
                    }
                    item.Filetimes = ADS.getLocalTime(item.Filetimes, '-', 1) || '';
                });
                this.dubiousData = dubiousData;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        getMore(){
            this.isMore = true;
            this.nearData = this.nearAllData;
        },
        getDataNear:async function(dataKey){// 附近谱目
            this.loading2 = true;
            this.isMore = false;
            let data = await api.getAxios('data/near?dataKey='+dataKey+'&siteKey='+this.stationKey);
            this.loading2 = false;
            if(data.status == 200){
                let nearData = [];
                if(data.data.length < 10){
                    this.isMore = true;
                }
                data.data.map((item,i)=>{
                    item.distance = (item.distance/1000).toFixed(3)
                    item.address = (item.prov || '') + ' ' + (item.city || '') + ' ' + (item.district || '');
                    if(i < 10){
                        nearData.push(item);
                    }
                });
                this.nearData = nearData;
                this.nearAllData = data.data;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
    },
    computed: {
        ...mapState({
            userName: state => state.nav.userName,
            userId: state => state.nav.userId,
            stationKey: state => state.nav.stationKey,
            role: state => state.nav.role,
            pathname: state => state.nav.pathname,
        })
    },
    watch:{
        'fieldFilters':function(newV,oldV){
            this.getJiapuList();
        },
        'row':function(nv,ov){
            console.log(nv);
            if(nv && nv._key){
                this.getDataRepeatDetail(nv._key);
                this.getDataNear(nv._key);
            }
        },
        'pumuThead': function(nv,ov){
            // console.log(nv);
            let nearDataField = [],repeatDetailField = [],repeatDetailFieldO = [];
            nv.forEach((ele) => {
                if(ele.fieldName === 'genealogyName'){
                    
                }else{
                    nearDataField.push(ele);
                }
            });
            
            this.nearDataField = nearDataField;
            this.repeatDetailFieldO = repeatDetailFieldO;
        }
    }
};
</script>
<style scoped lang="scss">
.section-box{
    position: relative;
    width: 100%;
}
.section-box-tab{
    display: flex;
    align-items: center;
    span{
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        &.active{
            border-bottom: 5px solid #358acd;
        }
    }
}
.table-wrap{
    width: 100%;
}
.place-wrap{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 500px;
    z-index: 10000;
    background-color: #fff;
}
.more{
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    border: none;
    outline: none;
    width: 60px;
    height: 20px;
    line-height: 20px;
    background: #358acd;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    border-radius: 3px;
}
.xTable2{
    width: 2400px;
}
.single-search{
    position: relative;
    width: 100%;
    overflow-y: auto;
}
.loading2{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0, 0.3);
    color: #fff;
}
.disabled{
    background-color: #ddd;
}
</style>

