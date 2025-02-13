import {Server} from "socket.io"

class SocketService{
    private static _io: Server;
    private constructor(){
        SocketService._io= new Server({
            cors: {
              origin: ["http://localhost:3000"," http://localhost:3001", "https://admin.socket.io"],
              credentials:true,
            },
          });     
    }
    public static configure(server:any){
      SocketService._io.attach(server);
    }
    public static getIo(){
      if(!SocketService._io){
        new SocketService();
      }
      return SocketService._io;
    } 
}

export default SocketService;