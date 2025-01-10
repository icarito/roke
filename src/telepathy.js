import Gun from "gun";

const gunConfig = { peers: ["http://roke.educa.juegos/gun"] }
const gun = Gun(gunConfig);

export function AstralPlane() {
    
  gun.get('astralPlane').once((data) => {
    console.log(data.face)
  })

  return <></>;
}
