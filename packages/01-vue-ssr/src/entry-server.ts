import  createApp  from './createApp';
import { ComponentOptions } from 'vue';

const isDev = process.env.NODE_ENV !== 'production'
export default (context:any):Promise<any> => {
   return  new Promise(async (resolve, reject)=>{
       const s:any = isDev && Date.now()
       const { app, router, store } = createApp();
       const { url } = context
       const { fullPath } = router.resolve(url).route;
       if (fullPath !== url) {
           return reject({ url: fullPath })
       }
       router.push(url);
     return   router.onReady(() => {
           const matchedComponents = router.getMatchedComponents();
           if (!matchedComponents.length) {
               return reject({ code: 404 })
           }
           try {
               Promise.all(matchedComponents.map(({ asyncData }:any) => asyncData && asyncData({
                   store,
                   route:
                   router.currentRoute

               }))).then(() => {
                   isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
                   context.state = store.state
                 return   resolve(app)
               }).catch(reject)
           }catch (e) {
               return reject(e);
           }
       },reject)

   })
}