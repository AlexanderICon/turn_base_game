

export enum HttpType {
    USER = 'user',  // 用户相关
    ACTOR = 'actor', //角色相关
    RAID = 'raid',  // 副本相关
    EQUIP = 'equipment', //装备相关
    RESOURCE = 'resource', //资源相关
}

type httpMessage<T> = {
    code:string,

    data:T,
}

export interface httpSend<T,U>{
    main:HttpType,
    sub:T,
    data:U,
}

export class http {
    private static ip = '49.235.121.188'
    private static port = '8080'
    private static httpMode = 'GET'
    //private static url = `${this.ip}:${this.port}/user/login?steamId=&nick=`

    static async request<T extends string,U extends object>(send:httpSend<T,U>){

        return await new Promise((reslove,reject) =>{
            let i = 1
            CreateHTTPRequest(this.httpMode,this.getUrl(send.main,send.sub,send.data)).Send((response) => {
                print('test Http',dump(response))
                const dataBody = JSON.decode(response.Body);
                if (response.StatusCode === 400){
                    reject({errorCode:response.StatusCode,errorData:dataBody})
                }else{
                    reslove(dataBody)
                }
               
            })      
            
        })
    }

    private static getUrl(m:HttpType,s:string,dt:object){
        let dataStr = ''
        for(const [k,v] of Object.entries(dt)){
            dataStr = dataStr + `${k}=${v}&`
        }
        dataStr = dataStr.substring(0,dataStr.length-1) //去掉末尾多余的&

        return `http://${this.ip}:${this.port}/${m}/${s}?${dataStr}`
    }

}
