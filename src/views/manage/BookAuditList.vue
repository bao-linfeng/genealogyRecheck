<template>  
    <div class="wrap">
        <div class="content">
            <ul class="nav-wrap">
                <li>
                    <h3>新谱查重列表-{{fileName}}(总共{{tableData.length}}条数据)</h3>
                </li>
                <li>
                    <!-- <el-checkbox v-if="active == 4" v-model="showAll">显示全部</el-checkbox> -->
                    <!-- <vxe-button content="一键可拍" v-if="active == 4" @click="setCanTakeBatch"></vxe-button> -->
                    <vxe-button v-if="batchLinkImage == 1" content="查看影像" @click="isShow = 1"></vxe-button>
                    <!-- <vxe-button content="批量审核通过" v-if="role >= 1 && role <= 3" @click="batchInBase"></vxe-button> -->
                    <!-- <vxe-button content="打回" v-if="active == 4" @click="dataVertifyHnadle('return')"></vxe-button> -->
                    <vxe-button content="批次确认" v-if="active == 4" @click="dataVertifyHnadle('past')"></vxe-button>
                    <i v-if="stationKey != '1528234980'" class="el-icon-delete refresh" title="删除批次" @click="removeBatchAll"></i>
                </li>
            </ul>
            <p class="condition">谱状态说明:f,审核通过且已拍摄;nf,审核通过未拍摄;r,无效谱;d,谱书重复;m,待议谱。</p>
            <div class="table-wrap" v-if="isTable">
                <!-- :edit-config="{trigger: 'dblclick', mode: 'row',showStatus: true, activeMethod:activeCellMethod}" -->
                <vxe-table
                    border
                    class="adai-table"
                    resizable
                    keep-source
                    highlight-current-row
                    ref="xTable"
                    :height="h*0.6"
                    :align="'center'"
                    :data="tableData"
                    :row-class-name="rowClassName"
                    @edit-closed="editClosedEvent"
                    :edit-config="{trigger: 'manual', mode: 'row'}"
                    
                    @cell-click="cellClickEvent">
                    <vxe-table-column fixed="left" v-if="active == 4" field="canTake" title="审核" width="160" :cell-render="{name:'AdaiTabButton', events:{'click':changeCanTake}}"></vxe-table-column>
                    <!-- <vxe-table-column fixed="left" width="100" field="_key" title="谱ID"></vxe-table-column> -->
                    <!-- :edit-render="item.disabled ? {enabled: false} : {name: 'input', attrs: {type: 'text'}}" -->
                    <vxe-table-column fixed="left" v-for="(item,index) in field_main" :key="'main'+index" width="100" :field="item.fieldName" :title="item.fieldMeans" :edit-render="item.disabled ? '' : {name: 'input', attrs: {type: 'text'}}"></vxe-table-column>
                    <!-- <vxe-table-column fixed="left" v-if="active == 4" field="annex" title="补充" width="80" :cell-render="{name: 'AdaiActionButton', attr: {data: [{'label': '补充','value':'annexEdit'}, ]}, events: {'annexEdit': annexEdit}}"></vxe-table-column> -->
                    <vxe-table-column v-if="active == 4" field="needFill" title="补充说明" width="80" :cell-render="{name:'AdaiSwitchButton',attr:{property:'needFill'},events:{'click':changeStatus}}"></vxe-table-column>
                    <!-- <vxe-table-column fixed="left" v-if="active == 4" width="120" field="needFillFieldsO" title="补充说明"></vxe-table-column> -->
                    <vxe-table-column v-if="active == 4" field="needImage" title="补充影像" width="80" :cell-render="{name:'AdaiSwitchButton',attr:{property:'needImage'},events:{'click':changeStatus}}"></vxe-table-column>
                    <vxe-table-column v-for="(item,index) in field_branch" :key="'branch'+index" width="100" :field="item.fieldName" :title="item.fieldMeans" :edit-render="item.disabled ? '' : {name: 'input', attrs: {type: 'text'}}"></vxe-table-column>
                    
                    <vxe-table-column fixed="right" field="action" title="操作" width="160" :cell-render="{name:'AdaiActionButton',attr:{data: attrData},events:{'catalogCheck': catalogCheck,'editBook': editBook, 'annex': annex, 'singleQuick': singleQuick, 'submit': handleSubmit}}"></vxe-table-column>
                </vxe-table>
            </div>
            <RepeatJiapuModal v-if="active >= 2" :row="row" :h="h" :pumuThead="pumuThead" :isF="true" />
        </div>
        <AnnexModal v-if="isShowAnnex" :gid="gid" :createUser="createUser" :row="annexRow" v-on:close-annex="isShowAnnex = false" :active="active" />
        <div class="needFill-box" v-if="isNeedFill">
            <h3>补充字段</h3>
            <img class="needFill-close" src="../../assets/close.svg" @click="isNeedFill = false" alt="">
            <vxe-select v-model="needFillList" placeholder="补充字段" multiple>
                <vxe-option v-for="(item,index) in needFillThead" :key="index" :value="item.fieldMeans" :label="item.fieldMeans"></vxe-option>
            </vxe-select>
            <input class="summary" type="text" v-model="remark" placeholder="备注" />
            <vxe-button content="保存" @click="saveNeedFill"></vxe-button>
        </div>
        <!-- 批次关联影像、审核时查看 -->
        <UploadImages v-if="isShow" :batchData="{'_key': this.batchId, 'look': 1}" v-on:close="isShow = 0" />
        <!-- 谱目编辑 -->
        <!-- <EditCatalog v-if="isEdit" :read="false" :dataKey="gid" :conditionEdit="true" :vid="''" v-on:close="closeEdit" /> -->
        <!-- 谱目审核 -->
        <ExamineCatalog v-if="isCheck" :detail="detail" v-on:close="closeExamine" />
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import AnnexModal from "../../components/QingTimeGenealogy/AnnexModal.vue";
import RepeatJiapuModal from "../../components/batchManage/RepeatJiapuModal.vue";
import EditCatalog from '../../components/takeCamera/EditCatalog.vue';
import { mapState, mapActions, mapGetters } from "vuex";
import UploadImages from '../../components/batchManage/UploadImages.vue';
import ExamineCatalog from '../../components/batchManage/ExamineCatalog.vue';
export default {
    name: "bookAuditList",
    components: {
        AnnexModal,RepeatJiapuModal, UploadImages, ExamineCatalog, 
        EditCatalog,
    },
    data: () => {
        return {
            tableData: [],
            batchId: '',
            filter: true,
            active: 0,
            row: {},
            caozheng:'1',
            caozhengs: [],
            total: 0,
            createUser: '',
            h: 1080,
            isShowAnnex: false,
            annexRow: '',
            gid: '',
            examine:'',
            examines: [{'label':'全部','value':''},
            {'label':'可拍机','value': 1},
            {'label':'补充字段','value':'needFill'},
            {'label':'临时影像','value':'needImage'},
            {'label':'无效','value': 2},
            {'label':'重复','value': 0}],
            needReview: '',
            pumuThead: [],
            pumuTheads: [],
            isShow: 0,
            isManage: false,
            repeatNum: 0,
            collapsable: false,
            needFillList: [],
            isNeedFill: false,
            needFillThead: [],
            dataStatus: '',
            remark: '',
            fileName: '',
            field_main: [],
            field_branch: [],
            isTable: false,
            showAll: true,
            attrData: [
                {'label':'附件','value':'annex'}, 
                {'label':'快捷查询','value':'singleQuick'}
            ],
            isEdit: false,
            isCheck: false,
            detail: {},
            batchLinkImage: '',
        };
    },
    created:function(){
        let search = window.location.search,param=ADS.params(search);
        this.batchId = param['batchID'] || '';
        this.fileName = param['f'] ? decodeURIComponent(param['f']) : '';
        this.active = param['state'] ? Number(param['state']) : 0;
        this.h = window.innerHeight - 110;
        console.log(this.fileName);
        if(this.active == 4){
            this.attrData = [
                // {'label': '审核', 'value': 'catalogCheck'},
                {'label': '编辑', 'value': 'editBook'},
                {'label': '确认', 'value': 'submit'},
                {'label':'附件','value':'annex'}, 
                {'label':'快捷查询','value':'singleQuick'}
            ];
        }

        this.field_main = [
            {'fieldMeans': '谱ID', 'fieldName': '_key', 'disabled': true},
            {'fieldMeans': '谱名', 'fieldName': 'genealogyName'},
            {'fieldMeans': '姓氏', 'fieldName': 'surname'},
            {'fieldMeans': '出版年', 'fieldName': 'publish'},
            {'fieldMeans': '堂号', 'fieldName': 'hall'},
        ];

        this.field_branch = [
            {'fieldMeans': '一世祖', 'fieldName': 'firstAncestor'},
            {'fieldMeans': '始迁祖', 'fieldName': 'migrationAncestor'},
            {'fieldMeans': '谱籍地(现代)', 'fieldName': 'place'},
            {'fieldMeans': '谱籍地(原籍)', 'fieldName': 'LocalityModern'},
            {'fieldMeans': '总卷数', 'fieldName': 'volume'},
            {'fieldMeans': '缺卷说明', 'fieldName': 'lostVolume'},
            {'fieldMeans': '可拍卷数', 'fieldName': 'hasVolume'},
            {'fieldMeans': '作者', 'fieldName': 'authors'},
            {'fieldMeans': '作者职务', 'fieldName': 'authorJob'},
            {'fieldMeans': '版本类型', 'fieldName': 'version'},
            {'fieldMeans': '重复谱ID', 'fieldName': 'Dupbookid'},
            {'fieldMeans': '备注', 'fieldName': 'memo'},
            {'fieldMeans': '说明', 'fieldName': 'explain'},
            {'fieldMeans': '谱状态', 'fieldName': 'condition', 'disabled': true},
            {'fieldMeans': '供应商代号', 'fieldName': 'organizationNo', 'disabled': true},
            {'fieldMeans': '档案时间', 'fieldName': 'Filetimes', 'disabled': true},
            {'fieldMeans': '档案名称', 'fieldName': 'Filenames', 'disabled': true},
            {'fieldMeans': '姓氏2', 'fieldName': 'surname2'},
            {'fieldMeans': '姓氏3', 'fieldName': 'surname3'},
            {'fieldMeans': '谱籍地(现代)2', 'fieldName': 'place2'},
            {'fieldMeans': '谱籍地(现代)3', 'fieldName': 'place3'},
        ];
    },
    mounted:function(){
        this.getPumuTable();
        this.getDataCheckLog();
    },
    methods:{
        annexEdit({row}){
            console.log(row);
            if(row.canTake == 3){
                this.needFillList = row.needFillFields;
                this.remark = row.remark;
                this.dataStatus = {'row': row, 'property': 'needFill'};
                this.isNeedFill = true;
            }
        },
        handleSubmit({row}){
            console.log(row);
            if(row.checkConfirm){
                return ADS.message('已经确认！');
            }
            this.$confirm('确认标记该谱目吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.GCCheckConfirm(row._key);
            }).catch(() => {});
        },
        async GCCheckConfirm(gcKey){// 标记谱目已处理
            let result = await api.postAxios('data/GCCheckConfirm', {
                'gcKey': gcKey,
                'userKey': this.userId,
            });
            if(result.status == 200){
                this.tableData.forEach((ele) => {
                    if(ele._key == gcKey){
                        ele.checkConfirm = 1;
                    }
                });
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' })
            }
        },
        closeExamine(f){
            this.isCheck = false;
            f ? this.getDataCheckLog() : null;
        },
        catalogCheck({row}){
            console.log(row);
            if(this.active == 4){
                if(row.willIn == 1){
                    this.gid = row._key;
                    this.detail = row;
                    this.isCheck = true;
                }else{
                    ADS.message('已入库，不允许修改');
                }
            }else{
                ADS.message('该状态不允许审核谱目！');
            }
        },
        editBook({row}){// 编辑谱目
            if(this.active == 4){
                // this.gid = row._key;
                this.isEdit = true;
                const $table = this.$refs.xTable;
                $table.setActiveRow(row);
            }else{
                ADS.message('该状态不允许编辑！');
            }
        },
        closeEdit(f){
            this.isEdit = false;
            f ? this.getDataCheckLog() : null; 
        },
        singleQuick({ row }){
            console.log(row);
            window.open('/'+this.pathname+'/singleQuickSearch?id='+row._key, '_blank');
        },
        removeBatchAll(){//删除批次所有数据确认函数
            this.$confirm('此操作将永久删除该批次所有数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.removeBatchData();
            }).catch(() => {});
        },
        removeBatchData:async function(){// 删除该批次所有数据
            let data=await api.deleteAxios('batch',{'batchKey':this.batchId,'userRole':this.role,'userKey':this.userId, 'siteKey': this.stationKey, 'orgKey': this.orgId});
            if(data.status == 200){
                this.$notify({
                    title: '提示',
                    message: this.userName+'删除了'+this.batchId+'批次数据',
                    duration: 0,
                    type: 'success'
                });
                this.$router.push('/'+window.localStorage.getItem('pathname')+'/batchmanage');
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        saveNeedFill(){
            console.log(this.needFillList);
            if((this.needFillList && this.needFillList.length) || this.remark){
                this.isNeedFill = false;
                this.changeDataStatus(this.dataStatus, this.needFillList, this.remark);
            }else{
                this.$XModal.message({ message: '请选择补充字段或填写备注', status: 'warning' });
            }
        },
        setCanTakeBatch:async function(){
            this.changeLoading();
            let data=await api.patchAxios('setCanTakeBatch',{'batchKey':this.batchId});
            this.changeLoading(false);
            if(data.status == 200){
                this.getDataCheckLog();
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        goBack(){
            history.go(-1);
        },
        suggInBatch:async function(){// 批次计划入库
            this.changeLoading();
            let data=await api.patchAxios('data/willIn/batch',{'batchKey':this.batchId});
            this.changeLoading(false);
            if(data.status == 200){
                this.getDataCheckLog();
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        getVertifyOption:async function(){// 可拍机状态检索
            let data=await api.getAxios('data/vertifyOption?batchKey='+this.batchId);
            if(data.status == 200){
                this.examines = data.result;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        getWillInOption:async function(){// 计划入库状态检索
            let data=await api.getAxios('data/willInOption?batchKey='+this.batchId);
            if(data.status == 200){
                this.caozhengs = data.result;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        changeLoading(flag = true){
            this.$store.dispatch('setPropertyValue',{'property':'loading','value': flag});
        },
        dataVertifyHnadle(operate){
            let isF = false, toBeRediscussed;
            this.$confirm('此操作将永久改变该批次谱目数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.dataVertify(operate);
            }).catch(() => {});
        },
        async dataVertify(operate){// 补充资料/审核通过
            this.changeLoading();
            let data = await api.postAxios('data/vertify',{'batchKey':this.batchId,'operate':operate, 'userKey': this.userId, 'orgKey': this.orgId});
            this.changeLoading(false);
            if(data.status == 200){
                if(operate == 'return'){
                    this.$XModal.message({ message: '打回成功', status: 'success' });
                    let timer = setTimeout(() => {
                        clearTimeout(timer);
                        timer = null;
                        this.$router.push({'path': ('/'+window.localStorage.getItem('pathname')+'/bookaudit')});
                    }, 200);
                }else{
                    this.active = 5;
                    this.getDataCheckLog();
                }
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        async batchInBase(){// 批量审核通过
            this.changeLoading();
            let data = await api.postAxios('batchInBase',{'batchKey':this.batchId, 'userKey': this.userId});
            this.changeLoading(false);
            if(data.status == 200){
                this.getDataCheckLog();
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        annex({row}){   
            if(row.hasFileOrRemark){
                this.annexRow = row;
                this.gid = row._key;
                this.isShowAnnex = true;
            }
            
        },
        changeCanTake:async function(data){// 谱目状态标记
            console.log(data);
            if(data.row.hasIn == '否'){
                this.changeLoading();
                let result = await api.patchAxios('data/status',{'dataKey':data.row._key,'canTake':data.status, 'userKey': this.userId, 'siteKey': this.stationKey});
                this.changeLoading(false);
                if(result.status == 200){
                    this.tableData.map((item)=>{
                        if(item._key == data.row._key){
                            item.canTake = data.status;
                            item.condition = data.status == 3 ? 'm' : data.status == 2 ? 'r' : data.status == 1 ? 'nf' : 'd';
                        }
                    });
                    // 待议 补充影像自动 2023.10.12
                    if(data.status == 3){
                        data.property = 'needImage';
                        this.changeDataStatus(data, [], '');
                    }
                }else{
                    this.$XModal.message({ message: result.msg, status: 'warning' });
                }
            }else{
                this.$XModal.message({ message: '已入库，不允许修改', status: 'warning' });
            }
        },
        changeStatus:async function(data){//改变状态
            console.log(data);
            this.dataStatus = data;
            if(data.property === 'needFill' && !data.row.needFill && data.row.canTake == 3){
                this.isNeedFill = true;
            }else{
                this.changeDataStatus(data, [], '');
            }
        },
        async changeDataStatus(data, needFillFields = '', remark = ''){//改变状态
            if(data.row.hasIn == '否'){
                if(data.row.canTake != 3){
                    return false;
                }
                this.changeLoading();
                let result = await api.patchAxios('data/status', {
                    'dataKey':data.row._key,
                    // data.property == 'needFill' ? 1 : 
                    [data.property]: data.row[data.property] ? '' : 1,
                    'needFillFields': needFillFields, 
                    'remark': remark, 
                    'userKey': this.userId, 
                    'siteKey': this.stationKey
                });
                this.changeLoading(false);
                if(result.status == 200){
                    this.tableData.map((item)=>{
                        if(item._key == data.row._key){
                            // item[data.property] = data.property == 'needFill' ? 1 : item[data.property] ? '' : 1;
                            // if(data.property == 'needFill'){
                            //     item.remark = remark;
                            //     item.needFillFields = needFillFields;
                            //     item.needFillFieldsO = (item.needFillFields ? item.needFillFields.join() : '') + (item.remark ? ' '+(item.remark || '') : '');
                            // }

                            item[data.property] = item[data.property] ? '' : 1;
                            item.remark = remark;
                            item.needFillFields = needFillFields;
                            item.needFillFieldsO = (item.needFillFields ? item.needFillFields.join() : '') + (item.remark ? ' '+(item.remark || '') : '');
                        }
                    });
                }else{
                    this.$XModal.message({ message: result.msg, status: 'warning' });
                }
            }else{
                this.$XModal.message({ message: '已入库，不允许修改', status: 'warning' });
            }
        },
        collapsableEvent () {
            this.collapsable = !this.collapsable;
            const xTable = this.$refs.xTable;
            xTable.refreshColumn();
        },
        activeCellMethod({row,column}){//控制编辑
            if(this.active != 4){
                return false;
            }
            if(['_key', 'condition', 'organizationNo', 'Filetimes', 'Filenames'].indexOf(column.property) > -1){
                return false;
            }
            if(['willIn', 'suggIn', 'hasIn', 'annex', 'delete', 'needFill', 'needImage'].indexOf(column.property) > -1){
                return false;
            }
            return true;
        },
        editClosedEvent({row}){
            this.editCatalog(row);
        },
        async editCatalog(row){// 编辑谱目
            let dataObj = {};
            this.field_main.map((item)=>{
                if(item.disabled){

                }else{
                    dataObj[item.fieldName] = row[item.fieldName];
                }
            });
            this.field_branch.map((item)=>{
                if(item.disabled){

                }else{
                    dataObj[item.fieldName] = row[item.fieldName];
                }
            });
            this.changeLoading();
            let data=await api.patchAxios('data/edit',{'dataKey':row._key,'dataObj':dataObj,'userKey': this.userId, siteKey: this.stationKey});
            this.changeLoading(false);
            if(data.status == 200){
                // this.getDataCheckLog();
                this.isEdit = false;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' });
            }
        },
        cellClickEvent({row,column}){
            if(this.isEdit){
                return false;
            }
            if(column.property == 'toggle' || column.property == 'action' || column.property == 'annex'){
                this.collapsableEvent();
                return false;
            }
            if(column.property == 'willIn' || column.property == 'annex' || column.property == 'delete' || column.property == 'needFill' || column.property == 'needImage'){
                this.row = {};
            }else{
                this.row = row;
            }
        },
        rowClassName ({ row, rowIndex }) {
            if(row.suggIn == '否') {
                return 'row-red'
            }
        },
        getDataCheckLog:async function(){// 批次列表谱目
            this.isTable = false;
            let data = await api.getAxios('data/checkLog/new?batchKey='+this.batchId+'&userRole='+this.role+'&userKey='+this.userId+'&willIn='+(this.active == 5 || this.active == 3 ? '' : (this.active == 4 ? this.showAll ? '' : 1 : ''))+'&needFill='+(this.examine == 'needFill' ? 1 : '')+'&canTake='+(this.examine == 'needFill' || this.examine == 'needImage' ? '' : this.examine)+'&needImage='+(this.examine == 'needImage' ? 1 : ''));
            this.isTable = true;
            if(data.status == 200){
                let batch = data.batch,state = 0,repeatNum = 0;
                batch.hasClean ? state = 1 : null;
                batch.hasCheckInBatch ? state = 2 : null;
                batch.hasCheckInISGN ? state = 3 : null;
                batch.needReview ? state = 3 : null;
                batch.hasSubmit ? state = 4 : null;
                batch.hasPast ? state = 5 : null;
                this.active = state;
                this.needReview = batch.needReview;
                this.createUser = batch.createUser;
                data.data.map((item)=>{
                    // item.fileName = this.fileName;
                    // item.toggle = '>';
                    item.address = item.prov+' '+item.city+' '+item.district;
                    item.Filetimes = ADS.getLocalTime(item.Filetimes, '/', 1) || item.Filetimes;
                    item.addInformation = (item.needFill ? '补充字段 ' : '')+(item.needImage ? '临时影像' : '');
                    item.suggIn = item.suggIn ? '是' : '否';
                    item.hasIn = item.hasIn ? '是' : '否';
                    item.location = item.location && item.location.length && item.location.join(',');
                    item.address = (item.prov || '') + ' ' + (item.city || '') + ' ' + (item.district || '');
                    item.willIns = item.willIn == 1 ? '是' : '否';
                    if(item.suggIn == '否'){
                        repeatNum = repeatNum + 1;
                    }
                    if(item.needFillFields || item.remark){
                        item.hasFileOrRemark = 1;
                    }
                    item.needFillFieldsO = (item.needFillFields ? item.needFillFields.join() : '') + (item.remark ? ' '+item.remark : '');
                });
                this.repeatNum = repeatNum;
                console.log(this.repeatNum);
                this.tableData = data.data;
                this.total = data.total;
                this.batchLinkImage = data.batchLinkImage;
            }else{
                this.$XModal.message({ message: data.msg, status: 'warning' })
            }
        },
        getPumuTable:async function(){// 谱目全部表头
            let data=await api.getAxios('field?type=家谱');
            if(data.status == 200){
                let pumuTheads = [];
                let needFillThead = [{'fieldName': 'firstAncestor', 'fieldMeans': '一世祖'}, {'fieldName': 'migrationAncestor', 'fieldMeans': '始迁祖'}, {'fieldName': 'lostVolume', 'fieldMeans': '缺卷'}];
                data.data.map((item)=>{
                    if(['Dupbookid', 'missVolumeSupplement', 'hasVolume','hasImage','genealogyName','publish','place','surname','authors','volume','hall','publishAD','address','authorFst','LocalityModern','lostVolume'].indexOf(item.fieldName) > -1){
                        
                    }else{
                        pumuTheads.push(item);
                    }
                    if(['firstAncestor', 'migrationAncestor', 'lostVolume'].indexOf(item.fieldName) > -1){

                    }else{
                        needFillThead.push(item);
                    }
                });
                this.pumuTheads = pumuTheads;
                this.pumuThead = data.data;

                this.needFillThead = needFillThead;
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
            orgId: state => state.nav.orgId,
            pathname: state => state.nav.pathname,
        })
    },
    watch:{
        'active': function(nv,ov){
            if(nv == 3){
                this.getWillInOption();
            }
            if(nv >= 3){
                // this.getVertifyOption();
            }
        },
        'showAll': function(){
            this.getDataCheckLog();
        },
    },
};
</script>
<style scoped lang="scss">
.wrap{
    position: relative;
    width: 100%;
    height: 100%;
    text-align: left;
    .content{
        position: relative;
        width: 100%;
        height: 100%;
        background: #EFF1F5;
        .nav-wrap{
            padding: 0 20px;
            width: calc(100% - 40px);
            display: flex;
            height: 60px;
            line-height: 60px;
            justify-content: space-between;
            align-items: center;
            li{
                display: flex;
                align-items: center;
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
    }
}
.needFill-box{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
    z-index: 1000;
    box-shadow: 0 0 2px 3px #ddd;
    .needFill-close{
        position: absolute;
        top: 20px;
        right: 20px;
        cursor: pointer;
        width: 20px;
        height: 20px;
    }
    .summary{
        width: 100%;
        height: 30px;
        line-height: 30px;
        border: 1px solid #ddd;
        border-radius: 3px;
        text-indent: 10px;
        display: block;
        margin: 10px 0;
        outline: none;
    }
}
.refresh{
    margin-left: 20px;
    cursor: pointer;
}
</style>

