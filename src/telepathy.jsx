import Gun from "gun";

const gunConfig = { peers: ["https://roke.educa.juegos/gun"] }
const gun = Gun(gunConfig);

export function AstralPlane() {
    
  gun.get('astralPlane').once((data) => {
    console.log(data.face)
  })

  return <></>;
}
