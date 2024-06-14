// https://expressjs.com/ko/starter/hello-world.html
const express = require('express');
const session = require('express-session');
const fileStore = require('session-file-store')(session);
const app = express()
const port = 3000

// express-session
app.use(
  session(
    {
      secret: 'secret key', //암호화하는 데 쓰일 키
      resave: false, // 세션에 변경사항이 없어도 항상 다시 저장할지 여부
      saveUninitialized: true, // 초기화되지 않은 세션을 스토어(저장소)에 강제로 저장할지 여부
      cookie: { // 세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
        httpOnly: true, // true 이면 클라이언트 자바스크립트에서 document.cookie로 쿠키 정보를 볼 수 없음
        secure: true, // true 이면 https 환경에서만 쿠키 정보를 주고 받도록 처리,
        maxAge: 60000 // 쿠키가 유지되는 시간 (밀리세컨드 단위)
      },
      store: new fileStore() // 세션 저장소로 fileStore 사용
    }
  )
)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const members = [
  { userid: "user1", userpw: "1111" },
  { userid: "user2", userpw: "2222" },
  { userid: "user3", userpw: "3333" },
];

app.get("/api/account", (req,res) => {
  // 쿠키에 로그인 정보가 있는지 체크
  // if(req.cookies && req.cookies.account) {
  //   const member = JSON.parse(req.cookies.account);
  //   if(member.userid) {
  //     return res.send(member)
  //   }
  // }

  // 세션 체크
  if(req.session.is_logined) {
    const member = JSON.parse({usreid : req.session.userid});
    return res.send(member);
  }
})

app.post('/api/login', (req, res) => {
  console.log(req.body);
  const userid = req.body.userid;
  const userpw = req.body.userpw;
  console.log(userid, userpw);
  const member = members.find( e => {
    return e.userid === userid && e.userpw === userpw;
  });
  

  if(member){
    // const options = {
    //   domain: "localhost",
    //   path: "/",
    //   maxAge: 10000, // 쿠키 유효시간
    //   httpOnly: true
    // };

    // res.cookie("account", JSON.stringify(member), options); // 로그인 시 쿠키에 값 저장 *** 쿠키는 보안에 취약함
    // res.send(member)

    // ********** 쿠키에서 세션 사용으로 리팩토링
    // 데이터베이스의 사용자 테이블에서 로그인 인증 처리 코드 작성
    // 사용자가 존재하면(로그인 처리가 성공하면)
      req.session.userid = userid; // 세션에 사용자 이메일 정보 저장
      req.session.is_logined = true; // 세션에 로그인 여부 저장
      req.session.save(err => { // 세션 저장
      if(err) throw err;
      res.send(member); 
      });
  } else {
    res.send(401); // 에러 상태코드 전송
  }

})

app.post('/api/logout', (req,res) => {
  // res.clearCookie("account") // 쿠키에 담긴 값을 제거함
  req.session.destroy();
  res.send(200);
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})