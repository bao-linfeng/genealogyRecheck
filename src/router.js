import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";
import GenealogySearch from "./views/GenealogySearch.vue";
import GenealogyDetail from "./views/GenealogyDetail.vue";
import View from "./views/View.vue";
import Payment from "./views/Payment.vue";
import PaymentOk from "./views/PaymentOk.vue";
import MyGenealogy from "./views/manage/BaseGenealogy.vue";
import QtGenealogy from "./views/manage/QingTimeGenealogy.vue";
import FGenealogy from "./views/manage/FGenealogy.vue";
import PurchaseHistory from "./views/manage/PurchaseHistory.vue";
import Message from "./views/manage/Message.vue";
import Coupon from "./views/manage/Coupon.vue";
import About from "./views/manage/About.vue";
import OCR from "./views/manage/OCR.vue";
import Payments from "./components/qtGenealogy/Payments.vue";
import CouponPayment from "./components/coupon/Payment.vue";
import CouponPaymentOk from "./components/qtGenealogy/PaymentOk.vue";
import NotFound from "./views/NotFound.vue";
import SwapListModal from "./views/manage/SwapListModal.vue";
import PerspectiveList from "./views/manage/PerspectiveListModal.vue";
import PumuCnki from "./views/manage/PumuCnki.vue";
import DataTypeDictionary from "./views/manage/DataTypeDictionary.vue";
import DataMenuField from "./views/manage/DataMenuField.vue";
import CnkiRule from "./views/manage/CnkiRule.vue";
import DataSource from "./views/manage/DataSource.vue";
import DataSourceModal from "./views/manage/DataSourceModal.vue";
import ModalMapTable from "./views/manage/ModalMapTable.vue";
import BatchManage from "./views/manage/BatchManage.vue";
import BatchDataStage from "./views/manage/BatchDataStage.vue";
import DORManage from "./views/manage/DORManage.vue";
import DORList from "./views/manage/DORList.vue";
import DORDetail from "./views/manage/DORDetail.vue";
import SupplierManage from "./views/manage/SupplierManage.vue";
import UserManage from "./views/manage/UserManage.vue";
import MonthReport from "./views/manage/MonthReport.vue";
import Institution from "./views/manage/Institution.vue";
import AuditOrg from './views/manage/AuditOrg.vue';
import BookAudit from './views/manage/BookAudit.vue';
import BookAuditList from './views/manage/BookAuditList.vue';
import TakeCamera from './views/manage/TakeCamera.vue';
import CameraDetail from './views/manage/CameraDetail.vue';
import CameraImage from './views/manage/CameraImage.vue';
import Bill from './views/manage/Bill.vue';
import CameraDevice from './views/manage/CameraDevice.vue';
import LogManage from './views/manage/LogManage.vue';
import ClaimLog from './views/manage/ClaimLog.vue';
import GenealogyRecheck from './views/manage/GenealogyRecheck';
import DupProjectID from './views/manage/DupProjectID.vue';
import RecycleBin from './views/manage/RecycleBin.vue';
import VolumeError from './views/manage/VolumeError.vue';
import ToBeDiscussedGC from './views/manage/ToBeDiscussedGC.vue';
import WorkloadAccount from './views/manage/WorkloadAccount.vue';
import VolumeStatusAccount from './views/manage/VolumeStatusAccount.vue';
import QuickRegistration from './views/manage/QuickRegistration.vue';
import SingleRecheck from './views/manage/SingleRecheck.vue';
import CatalogSearch from './views/manage/CatalogSearch.vue';
import VolumeSearch from './views/manage/VolumeSearch.vue';
import SingleQuickSearch from './views/manage/SingleQuickSearch.vue';
import AutoCompleteSearch from './components/takeCamera/AutoCompleteSearch.vue';
import MenuDefinition from './views/manage/MenuDefinition.vue';
import RoleDefinition from './views/manage/RoleDefinition.vue';
import CatalogWorkload from './views/manage/CatalogWorkload.vue';
import ViewImage from './views/manage/ViewImage.vue';
import CatalogCheckStatistics from './views/manage/CatalogCheckStatistics.vue';
import CatalogEditStatistics from './views/manage/CatalogEditStatistics.vue';
import QCamLog from './views/manage/QCamLog.vue';



Vue.use(Router);

const routes = [
  {
    path: "/404",
    name: "notfound",
    component: NotFound
  },
  {
    path: "/:id/QCamLog",
    name: "QCamLog",
    meta: {
      requireAuth: true,
    },
    component: QCamLog
  },
  {
    path: "/:id/CatalogEditStatistics",
    name: "CatalogEditStatistics",
    meta: {
      requireAuth: true,
    },
    component: CatalogEditStatistics
  },
  {
    path: "/:id/CatalogCheckStatistics",
    name: "CatalogCheckStatistics",
    meta: {
      requireAuth: true,
    },
    component: CatalogCheckStatistics
  },
  {
    path: "/:id/viewImage",
    name: "ViewImage",
    meta: {
      requireAuth: true,
    },
    component: ViewImage
  },
  {
    path: "/:id/catalogWorkload",
    name: "CatalogWorkload",
    meta: {
      requireAuth: true,
    },
    component: CatalogWorkload
  },
  {
    path: "/:id/roleDefinition",
    name: "RoleDefinition",
    meta: {
      requireAuth: true,
    },
    component: RoleDefinition
  },
  {
    path: "/:id/menuDefinition",
    name: "MenuDefinition",
    meta: {
      requireAuth: true,
    },
    component: MenuDefinition
  },
  {
    path: "/:id/autoCompleteSearch",
    name: "AutoCompleteSearch",
    meta: {
      requireAuth: true,
    },
    component: AutoCompleteSearch
  },
  {
    path: "/:id/singleQuickSearch",
    name: "SingleQuickSearch",
    meta: {
      requireAuth: true,
    },
    component: SingleQuickSearch
  },
  {
    path: "/:id/volumeSearch",
    name: "VolumeSearch",
    meta: {
      requireAuth: true,
    },
    component: VolumeSearch
  },
  {
    path: "/:id/catalogSearch",
    name: "CatalogSearch",
    meta: {
      requireAuth: true,
    },
    component: CatalogSearch
  },
  {
    path: "/:id/singleRecheck",
    name: "SingleRecheck",
    meta: {
      requireAuth: true,
    },
    component: SingleRecheck
  },
  {
    path: "/:id/quickRegistration",
    name: "QuickRegistration",
    meta: {
      requireAuth: true,
    },
    component: QuickRegistration
  },
  {
    path: "/:id/volumeStatusAccount",
    name: "VolumeStatusAccount",
    meta: {
      requireAuth: true,
    },
    component: VolumeStatusAccount
  },
  {
    path: "/:id/workloadAccount",
    name: "WorkloadAccount",
    meta: {
      requireAuth: true,
    },
    component: WorkloadAccount
  },
  {
    path: "/:id/toBeDiscussedGC",
    name: "ToBeDiscussedGC",
    meta: {
      requireAuth: true,
    },
    component: ToBeDiscussedGC
  },
  {
    path: "/:id/volumeError",
    name: "volumeError",
    meta: {
      requireAuth: true,
    },
    component: VolumeError
  },
  {
    path: "/:id/recycleBin",
    name: "recycleBin",
    meta: {
      requireAuth: true,
    },
    component: RecycleBin
  },
  {
    path: "/:id/dupProjectID",
    name: "dupProjectID",
    meta: {
      requireAuth: true,
    },
    component: DupProjectID
  },
  {
    path: "/:id/genealogyRecheck",
    name: "genealogyRecheck",
    meta: {
      requireAuth: true,
    },
    component: GenealogyRecheck
  },
  {
    path: "/:id/logManage",
    name: "LogManage",
    meta: {
      requireAuth: true,
    },
    component: LogManage
  },
  {
    path: "/:id/claimLog",
    name: "ClaimLog",
    meta: {
      requireAuth: true,
    },
    component: ClaimLog
  },
  {
    path: "/:id/cameraDevice",
    name: "CameraDevice",
    meta: {
      requireAuth: true,
    },
    component: CameraDevice
  },
  {
    path: "/:id/bill",
    name: "Bill",
    meta: {
      requireAuth: true,
    },
    component: Bill
  },
  {
    path: "/:id/takeCamera",
    name: "TakeCamera",
    meta: {
      requireAuth: true,
    },
    component: TakeCamera
  },
  {
    path: "/:id/cameraDetail",
    name: "CameraDetail",
    meta: {
      requireAuth: true,
    },
    component: CameraDetail
  },
  {
    path: "/:id/cameraImage",
    name: "CameraImage",
    meta: {
      requireAuth: true,
    },
    component: CameraImage
  },
  {
    path: "/:id/DORlist",
    name: "DORList",
    meta: {
      requireAuth: true,
    },
    component: DORList
  },
  {
    path: "/:id/bookAuditList",
    name: "bookAuditList",
    meta: {
      requireAuth: true,
    },
    component: BookAuditList
  },
  {
    path: "/:id/bookAudit",
    name: "bookAudit",
    meta: {
      requireAuth: true,
    },
    component: BookAudit
  },
  {
    path: "/:id/institution",
    name: "institution",
    meta: {
      requireAuth: true,
    },
    component: Institution
  },
  {
    path: "/:id/auditOrg",
    name: "auditOrg",
    meta: {
      requireAuth: true,
    },
    component: AuditOrg
  },
  {
    path: "/:id/monthreport",
    name: "monthreport",
    meta: {
      requireAuth: true,
    },
    component: MonthReport
  },
  {
    path: "/:id/usermanage",
    name: "usermanage",
    meta: {
      requireAuth: true,
    },
    component: UserManage
  },
  {
    path: "/:id/message",
    name: "message",
    meta: {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: Message
  },
  {
    path: "/:id/coupon",
    name: "coupon",
    meta: {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: Coupon
  },
  {
    path: "/payments",
    name: "payments",
    component: Payments
  },
  {
    path: "/couponPaymentOk",
    name: "couponPaymentOk",
    component: CouponPaymentOk
  },
  {
    path: "/couponPayment",
    name: "couponPayment",
    component: CouponPayment
  },
  {
    path: "/:id/purchaseHistory",
    name: "purchaseHistory",
    meta: {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: PurchaseHistory
  },
  {
    path: "/:id/qtGenealogy",
    name: "qtGenealogy",
    meta: {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: QtGenealogy
  },
  {
    path: "/:id/fgenealogy",
    name: "fgenealogy",
    meta: {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: FGenealogy
  },
  {
    path: "/:id/myGenealogy",
    name: "myGenealogy",
    meta: {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: MyGenealogy
  },
  {
    path: "/:id/swapListModal",
    name: "swapListModal",
    meta: {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: SwapListModal
  },
  {
    path: "/:id/perspectiveList",
    name: "perspectiveList",
    meta: {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: PerspectiveList
  },
  {
    path:'/:id/pumucnki',
    name:"pumucnki",
    meta:{
      requireAuth:true
    },
    component:PumuCnki
  },
  {
    path:'/:id/batchManage',
    name:'batchmanage',
    meta:{
      requireAuth:true
    },
    component:BatchManage
  },
  {
    path:'/:id/batchdatastage',
    name:'batchdatastage',
    meta:{
      requireAuth:true
    },
    component:BatchDataStage
  },
  {
    path:'/:id/dor',
    name:'dormanage',
    meta:{
      requireAuth:true
    },
    component: DORManage
  },
  {
    path:'/:id/dor/detail',
    name:'dordetail',
    meta:{
      requireAuth:true
    },
    component: DORDetail
  },
  {
    path:'/:id/suppliermanage',
    name:'suppliermanage',
    meta:{
      requireAuth:true
    },
    component: SupplierManage
  },
  {
    path:'/:id/dataTypeDictionary',
    name:"dataTypeDictionary",
    meta:{
      requireAuth:true
    },
    component:DataTypeDictionary
  },
  {
    path:'/:id/datamenufield',
    name:'datamenufield',
    meta:{
      requireAuth:true
    },
    component:DataMenuField
  },
  {
    path:'/:id/cnkirule',
    name:'cnkirule',
    meta:{
      requireAuth:true
    },
    component:CnkiRule
  },
  {
    path:'/:id/datazource',
    name:'datasource',
    meta:{
      requireAuth:true
    },
    component:DataSource
  },
  {
    path:'/:id/datasourcemodal',
    name:'datasourcemodal',
    meta:{
      requireAuth:true
    },
    component:DataSourceModal
  },
  {
    path:'/:id/datasourcemodal/maptable',
    name:'modalmaptable',
    meta:{
      requireAuth:true
    },
    component:ModalMapTable
  },
  {
    path: "/:id/about",
    name: "about",
    component: About
  },
  {
    path: "/:id/ocr",
    name: "ocr",
    component: OCR
  },
  {
    path: "/payment",
    name: "payment",
    component: Payment
  },
  {
    path: "/paymentok",
    name: "paymentok",
    component: PaymentOk
  },
  {
    path: "/:id",
    name: "home",
    component: Home
  },
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/:id/genealogySearch",
    name: "genealogySearch",
    component: GenealogySearch
  },
  {
    path: "/:id/gd",
    name: "genealogyDetail",
    meta: {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: GenealogyDetail
  },
  {
    path: "/:id/view",
    name: "view",
    meta: {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    component: View
  },
];


let router=new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes
});

router.beforeEach((to, from, next) => {
  // console.log(to);
  let path = to.path.replace('/',''),index=path.indexOf('/');
  window.localStorage.getItem('pathname') ? null : window.localStorage.setItem('pathname',path.substr(0,index));
  (to.path == '/'+window.localStorage.getItem('pathname')) || (to.path == '/'+window.localStorage.getItem('pathname')+'/') ? null : window.localStorage.setItem('path',to.path.replace('/',''));
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (window.localStorage.getItem('token') && window.localStorage.getItem('stationKey')) {  // 通过vuex state获取当前的token是否存在
      next();
    }else {
      // let origin=window.location.origin,pathname=window.localStorage.getItem('pathname'),search=window.localStorage.getItem('path').replace(pathname,'');
      // window.location.href = 'https://baokulogin.qingtime.cn?origin='+encodeURI(origin)+'&param='+pathname+'&router='+search;
      next({
        // path:'/404',
          path: ('/'+window.localStorage.getItem('pathname')),
          // query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }else {
    next();
  }
})

export default router
