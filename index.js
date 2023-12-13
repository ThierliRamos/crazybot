const {default: makeWASocket, delay, WA_DEFAULT_EPHEMERAL, downloadMediaMessage, downloadContentFromMessage, DisconnectReason, getAggregateVotesInPollMessage, BufferJSON, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const P = require("pino")
const { exec } = require('child_process')
const axios = require("axios")
const ms = require("ms")
const pms = require("parse-ms")
const FormData = require('form-data')
const fs = require("fs-extra")
const {config} = require("./config")
prefix = "/"
dono = [`${config.dono}@s.whatsapp.net`, "559184035474@s.whatsapp.net"]
dono2 = `${config.dono}`
imagineFila = []
gemFila = []
tempOn = Date.now()
modoOn = JSON.parse(fs.readFileSync("./modo.txt"));
vip = JSON.parse(fs.readFileSync("./vip.json"));

//FUNÇÕES BÁSICAS 
async function telePost(buf) {
  ti = 'image/jpeg'
  try {
  const form = new FormData()
  form.append("photo", buf, {
    filename: 'blob',ti
  })
  data = await axios({
    method:"post",
    url: "https://telegra.ph/upload",
    data: form
  })
  if(!data) return false
  return {url: "https://telegra.ph"+data.data[0].src, path: data.data[0].src}
  } catch (e) {
    console.log(e)
    return false
  }
}
async function baixarMidia(me) {
  try {
    buffer = await downloadMediaMessage(me, "buffer")
    return buffer
  } catch (e) {
    console.log(e)
    return false
  }
}
function repla(num) {
  i = num.indexOf("@")
  return num.slice(0,i)
}
async function fetchJson(url) {
  try {
    resul = await axios({
      method: "get",
      url: url
    })
    return resul.data
  } catch (e) {
    console.log(e)
    console.log("Deu erro no fetchJson")
    return false
  }
}
//CONECTAR COM O WHATSAPP 
async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./login')
  const client = await makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    markOnlineOnConnect: modoOn,
    keepAliveIntervalMs: 16000
  })
  client.ev.on('creds.update', saveCreds)
  
  client.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        //console.log(connection)
        if(connection == "connecting") {
          console.log("Conectando...")
        }
        if(connection === 'close') {
            //const shouldReconnect = (lastDisconnect.error in Boom).output.statusCode !== DisconnectReason.loggedOut
            console.log(DisconnectReason)
            console.log('Conexão fechada por: ', lastDisconnect, ', Reconectando...')
            // reconnect if not logged out
                await delay(3000)
                connectToWhatsApp()
        } else if(connection === 'open') {
            console.log('CONECTADO COM SUCESSO!')
            console.log("#######################")
            console.log("Caso você tenha lido o qrcode agora, espere 10 segundos e depois dê um CTRL+c")
            console.log("#######################")
            await delay(1000*1)
            await client.sendMessage(dono[0], {text: "Bot Online", contextInfo: {expiration: 100*100}})
            console.log("Aviso enviado!")
        }
    })
    console.log("Abrindo navegador...")
    
    client.ev.on('messages.upsert', async m => {
        //client.sendPresenceUpdate('available')
        if(m.messages[0].key.id.startsWith("BAE")) return
        message = m.messages[0]
        message0 = m.messages[0]
        msg = message.message
        if (!msg) return
        message = message
        key = message.key
        fromMe = key.fromMe
        if (key.remoteJid == "status@broadcast") return
        //if (fromMe) return
        from = key.remoteJid
        isGroup = from.includes("@g.us")
        //if (isGroup) return
        jid = isGroup ? key.participant : from
        name = message.pushName ? message.pushName : ""
        //console.log(msg)
        galo = Object.keys(msg)
        galo2 = JSON.stringify(msg, null, 2)
        sumir2 = 0
        isDono = dono.includes(jid)
        isVip = vip.includes(repla(jid))
        isQuote = galo2.includes("quotedMessage")
        isImage = galo.includes("imageMessage")
        isVideo = galo.includes("videoMessage")
        isImage2 = galo2.includes("imageMessage")
        isVideo2 = galo2.includes("videoMessage")
        if(galo2.includes("expiration")) {
        if(galo.includes("extendedTextMessage")) {
        sumir2 = msg.extendedTextMessage.contextInfo.expiration
        }
        }
        sumir = {expiration: sumir2}
        body = galo.includes("conversation") ? msg.conversation : galo.includes("extendedTextMessage") ? msg.extendedTextMessage.text : isImage ? msg.imageMessage.caption : isVideo ? msg.videoMessage.caption : "outra midia"
        body = body.toLowerCase()
        isCmd = body.startsWith(prefix) ? true : false
        cmd = body.split(" ")[0]
				args = body.split(" ").slice(1).join().replace(/,/g, " ")
				//console.log(cmd)
				//console.log(args)
				//console.log(isCmd)
        if (!isGroup && modoOn){
        client.readMessages([key])
        }
        if(modoOn) {
        client.sendPresenceUpdate('available', jid)
        }
        if(!modoOn) {
        client.sendPresenceUpdate('unavailable') // para ficar off
        }
        
        //###### FUNÇÕES BÁSICAS #######
        async function reply(text) {
          await client.sendMessage(from, {text: text, contextInfo: sumir}, {quoted: message})
        }
        async function reply2(pv, text) {
          await client.sendMessage(pv, {text: text})
        }
        async function fimagine(q, njid, men) {
          try {
                 if(imagineFila.length > 0) {
                   await delay(3000)
                 }
                data = await fetchJson("https://api.megah.tk/imagineAi?q="+encodeURI(q))
                console.log(data)
                if(!data) {
                  imagineFila = []
                  return await client.sendMessage(njid, {text: "Ocorreu um erro na api"}, {quoted: men})
                }
                imagineFila = []
                await client.sendMessage(njid, {image: {url: data.result}, caption: data.msg+"\n\nGerada em: "+data.time, contextInfo: sumir}, {quoted: men})
          } catch (e) {
            console.log(e)
            imagineFila = []
            await client.sendMessage(njid, {text: "Deu erro", contextInfo: sumir}, {quoted: men})
          }
        }
        async function femhd(buf, njid, men) {
          try {
            if(!Buffer.isBuffer(buf)) {
              gemFila = []
              return await client.sendMessage(njid, {text: "Não contém buffer"}, {quoted: men})
            }
            if(gemFila.length > 0) {
              await delay(3000)
            }
            imgLink = await telePost(buf)
            if(!imgLink) {
              gemFila = []
              return await client.sendMessage(njid, {text: "Deu erro no upload da imagem"}, {quoted: men})
            }
            data = await fetchJson("https://api.megah.tk/imgHd?q="+imgLink.url)
            console.log(data)
            if(!data) {
              gemFila = []
              return await client.sendMessage(njid, {text: "Ocorreu um erro na api"}, {quoted: men})
            }
            gemFila = []
            await client.sendMessage(njid, {image: {url: data.result}, caption: data.msg+"\n\nGerada em: "+data.time, contextInfo: sumir}, {quoted: men})
          } catch (e) {
            console.log(e)
            gemFila = []
            await client.sendMessage(njid, {text: "Deu erro", contextInfo: sumir}, {quoted: men})
          }
        }
        
        if(!fromMe && !isGroup) {
          console.log(`\n\nMensagem no privado de ${repla(jid)}\n\nMensagem: ${body}\n\n############`)
        }
        if(!fromMe && isGroup) {
          console.log(`\n\nMensagem no grupo ${from} de ${repla(jid)}\n\nMensagem: ${body}\n\n############`)
        }
        
        switch (cmd) {
          case "/imagine":
          case "imagine":
            if(args.length < 1) return reply("Quer gerar o quê?")
            reply("Aguarde...")
            fimagine(args, from, message)
            imagineFila.push(from)
            break;
          case "/ia":
          case "ia":
            if(args < 1) return reply("digite alguma coisa depois de /ia")
            try {
            reply("Aguarde...")
            data = await fetchJson("https://vihangayt.me/tools/chatgptv4?q="+args)
            if(data || data.status) {
              return reply(data.data)
            } else if(!data || !data.status) {
              data = await fetchJson("https://vihangayt.me/tools/chatgpt2?q="+args)
              if(data || data.status) {
                return reply(data.data)
              } else if(!data || !data.status) {
                data = await fetchJson("https://vihangayt.me/tools/chatgpt3?q="+args)
                if(data || data.status) {
                  return reply(data.data)
                } else {
                  return reply("Deu erro em todas as api")
                }
              }
            } else {
              return reply("Deu erro na api")
            }
            } catch (e) {
              console.log(e)
              reply("Deu erro")
            }
            break;
          case "hd":
          case "/hd":
          try {
            if(isImage) {
              reply("Aguarde...")
              memedia = await baixarMidia(message0)
              femhd(memedia, from, message)
              gemFila.push(from)
            } else if(isQuote && isImage2) {
              reply("Aguarde...")
              message0.message = msg.extendedTextMessage.contextInfo.quotedMessage
              //console.log(message0)
              memedia = await baixarMidia(message0)
              femhd(memedia, from, message)
              gemFila.push(from)
            } else {
              reply("Marque uma imagem com a qualidade ruim")
            }
          } catch (e) {
            console.log(e)
            reply("Deu erro")
          }
            break;
          case "play":
          case "/play":
            try {
            if(args < 1) return reply("Qual o nome da música?")
            reply("Aguarde...")
            playData = await fetchJson("https://api.megah.tk/ytmp3?q="+encodeURI(args))
            playData = playData[0]
            playCap = `🔎 Fonte: ${playData.fonte}\n\n🕰️ Publicado: ${playData.publicado}\n👀 Views: ${playData.views}\n⌛ Duração: ${playData.duracao}\n\nEnviando sua música, aguarde...`
            await client.sendMessage(from, {
              text: playCap,
              contextInfo: {
                expiration: sumir2,
                externalAdReply: {
                  title: playData.titulo,
                  body: `ILIMITHI Bot`,
                  thumbnailUrl: playData.thumb,
                  mediaType: 1,
                  showAdAttribution: false,
                  renderLargerThumbnail: true
                }
              }
            }, {quoted: message})
            await client.sendMessage(from, {audio: {url: playData.url}, contextInfo: sumir, mimetype: "audio/mpeg"}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "deu erro", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro music 2")
            }
            break;
          case "vídeo":
          case "video":
          case "/video":
          case "/vídeo":
            try {
            if(args < 1) return reply("Qual o nome do vídeo?")
            reply("Aguarde...")
            playData = await fetchJson("https://api.megah.tk/ytmp4?q="+encodeURI(args))
            playData = playData[0]
            playCap = `🔎 Fonte: ${playData.fonte}\n\n🕰️ Publicado: ${playData.publicado}\n👀 Views: ${playData.views}\n⌛ Duração: ${playData.duracao}\n\nEnviando seu vídeo, aguarde...`
            await client.sendMessage(from, {
              text: playCap,
              contextInfo: {
                expiration: sumir2,
                externalAdReply: {
                  title: playData.titulo,
                  body: "ILIMITHI (box)",
                  thumbnailUrl: playData.thumb,
                  mediaType: 1,
                  showAdAttribution: false,
                  renderLargerThumbnail: true
                }
              }
            }, {quoted: message})
            await client.sendMessage(from, {video: {url: playData.url}, fileName: encodeURI(playData.titulo)+".mp4", contextInfo: sumir, mimetype: "video/mp4"}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "deu erro", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro music 2")
            }
            break;
          case "addvip":
          case "/addvip":
            if(!isDono) return reply("Apenas meu dono pode usar esse comando")
            if(args < 1) return reply("Cadê o número do sujeito?")
            vip = JSON.parse(fs.readFileSync("./vip.json"));
            args = args.replaceAll("+","").replaceAll(" ","").replaceAll("-","")
            console.log(args)
            if(vip.includes(args)) return reply("Ué, essa pessoa já é vip")
            vip.push(args)
            await fs.writeFileSync("./vip.json", JSON.stringify(vip, null, 2))
            reply("Adicionado com sucesso!")
            break;
          case "delvip":
          case "/delvip":
            if(!isDono) return reply("Apenas meu dono pode usar esse comando")
            if(args < 1) return reply("Cadê o número do sujeito?")
            vip = JSON.parse(fs.readFileSync("./vip.json"));
            args = args.replaceAll("+","").replaceAll(" ","").replaceAll("-","")
            console.log(args)
            if(!vip.includes(args)) return reply("Ué, essa pessoa não está no sistema")
            i = vip.indexOf(args)
            vip.splice(i,1)
            await fs.writeFileSync("./vip.json", JSON.stringify(vip, null, 2))
            reply("Removido com sucesso!")
            break;
          case "cpf":
          case "/cpf":
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("Apenas pessoas autorizadas podem usar esse comando")
            if(args < 1) return reply("Cadê o cpf?")
            reply("Aguarde...")
            cpfData = await fetchJson(`https://apicpf.megah.tk/cpf.php?token=boxprem&consulta=${args}`)
            if(cpfData.status == 404) return await client.sendMessage(from, {text: "Não encontrado", contextInfo: sumir}, {quoted: message})
            if(cpfData.status == 400) {
              await client.sendMessage(from, {text: "Cpf inválido (pode ser um erro, tente novamente)", contextInfo: sumir}, {quoted: message})
              console.log(cpfData)
              return
            }
            if(cpfData.status != 200) {
              await client.sendMessage(from, {text: "Não encontrado²", contextInfo: sumir}, {quoted: message})
              console.log(cpfData)
              return
            }
            telNum = ""
            if(cpfData.telefones.length > 0) {
              for (tels of cpfData.telefones) {
                telNum += tels+"\n"
              }
            } else {
              telNum += "Sem informação\n"
            }
            //console.log(cpfData)
            cpfText = `🔎 Consulta De CPF (Megah-API)

[⚙️] Módulo: Cpf [SIPNI]
[👨🏽‍💻] Cpf Informado: ${cpfData.cpf}

「📌」𝑫𝒂𝒅𝒐𝒔 𝑬𝒏𝒄𝒐𝒏𝒕𝒓𝒂𝒅𝒐𝒔「📌」

▸ Nome: ${cpfData.nome}
▸ Cns: ${cpfData.cns}
▸ Data De Nascimento: ${cpfData.nascimento}
▸ Idade: ${cpfData.idade}
▸ Gênero: ${cpfData.genero}
▸ Mãe: ${cpfData.mae}
▸ Pai: ${cpfData.pai}
▸ Grau De Qualidade: ${cpfData.qualidade}
▸ Em Obito? ${cpfData.obito}
▸ Cor: ${cpfData.cor}

▸ Telefones:\n${telNum}

「🏠」 Endereço Vinculado「🏠」

▸ Logradouro: ${cpfData.logradouro}
▸ Número: ${cpfData.numeroCasa}
▸ Bairro: ${cpfData.bairro}
▸ Município: ${cpfData.municipio}
▸ Estado: ${cpfData.estado}
▸ Cep: ${cpfData.cep}

「🏡」 Local de Nascimento「🏡」

▸ Município: ${cpfData.muniNasc} 
▸ Estado: ${cpfData.estadoNasc} 
`
await client.sendMessage(from, {text: cpfText, contextInfo: sumir}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "Algo deu errado (erro)", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro no cpf")
            }
            break;
          case "tempon":
          case "tempo":
            tempOn2 = pms(Date.now()-tempOn)
            console.log(tempOn2)
            plaq4 = `*Tempo Online*\n\n*Dias*: ${tempOn2.days}\n*Horas*: ${tempOn2.hours}\n*Minutos*: ${tempOn2.minutes}\n*Segundos*: ${tempOn2.seconds}`
            reply(plaq4)
            break;
          case "restart":
          case "res":
          case "/restart":
            if(!dono.includes(jid)) return reply("Somente meu dono pode usar esse comando")
            reply("Reiniciando Sistema, aguarde...")
            await delay(1000)
            console.log(RESTART)
            break;
          case "modo":
          case "/modo":
            if(!dono.includes(jid)) return reply("Somente meu dono pode usar esse comando")
            if(args.length < 1) return reply("On ou off?")
            if(args == "on") {
              if(modoOn == true) return reply("Ué, mas já está On")
              modoOn = true
              reply("Certo, agora vou ler as mensagens\n\nReiniciando sistema, Aguarde...")
              await fs.writeFileSync("./modo.txt", JSON.stringify(modoOn))
              await delay(1000)
              console.log(RESTART)
            } else if(args == "off") {
              if(modoOn == false) return reply("Ué, mas já está Off")
              modoOn = false
              reply("Ok chefe, agora não vou ler as mensagens\n\nReiniciando sistema, Aguarde...")
              await fs.writeFileSync("./modo.txt", JSON.stringify(modoOn))
              await delay(1000)
              console.log(RESTART)
            } else {
              reply("Use assim:\n\n*/modo on*\n\nOu\n\n*/modo off*")
            }
            break;
          
          default:
            // code
        }
    }) //upsert
} //função iniciar
connectToWhatsApp().catch(e => {
  console.log(e)
  console.log("deu erro na função connectToWhatsApp")
})