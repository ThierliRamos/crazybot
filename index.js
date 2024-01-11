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
const q =
prefix = "/"
dono = [`${config.dono}@s.whatsapp.net`, "557398300193@s.whatsapp.net"]
dono2 = `🟢 73999423092`
imagineFila = []
gemFila = []
tempOn = Date.now()
modoOn = JSON.parse(fs.readFileSync("./modo.txt"));
vip = JSON.parse(fs.readFileSync("./vip.json"));

var Mediadata;
var dataAtual = new Date();
var dia = dataAtual.getDate();
var mes = (dataAtual.getMonth() + 1);
var ano = dataAtual.getFullYear();
var horas = dataAtual.getHours();
var minutos = dataAtual.getMinutes();
// saída: Hoje é dia 15/7 de 2020. Agora são 14:59h.

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




exports.sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
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
        args = body.split(" ").slice(1).join().replace(/,/g, " ")
        body = body.toLowerCase()
        isCmd = body.startsWith(prefix) ? true : false
        cmd = body.split(" ")[0]
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
        async function _getPageSource(callback) {
          var url = {
              text: callback
          };
          var embed = {
              quoted: message
          };
          await client.sendMessage(from, url, embed);
      }

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
        
async function formatNumber(){
  try {
  var nuns = fs.readFileSync("./numeros.txt").toString()
  nuns = nuns.split("\n")
  var nunsF = []
  for (let um of nuns) {
    format = um.replaceAll(" ","").replaceAll("-","").replaceAll("+","").replaceAll("\r", "")+"@s.whatsapp.net"
    nunsF.push(format)
    //console.log(format)
  }
  //console.log(nunsF)
  return nunsF
 } catch(e) {
   console.log(e)
   return []
 }
}

async function massa(texto, njid, de) {
       try {
         await client.sendMessage(njid, {text: "⌛️ Enviando suas mensagens..."})
         numbers = await formatNumber()
         console.log(numbers)
         console.log(texto)
         if(numbers.length < 1) {
           await client.sendMessage(njid, {text: "Nenhum número no arquivo numeros.txt ou algo está errado, veja os logs"})
           return
         }
         await client.sendMessage(njid, {text: "📝 Veja os logs para acompanhar"})
         await delay(2000)
         for (let i = 0; i < numbers.length; i++) {
           await client.sendMessage(numbers[i], {image: {url: "./thierli.jpg"}, mimetype: "image/jpeg", caption: "Neste ano de 2024 começa a corrida para elegermos prefeito(a) e vereadores que irão se comprometer a buscarem soluções e respostas à sociedade por 4 anos!\n\n⚠️ Eu, Thierli Ramos, pré-candidato a Vereador por Nova Viçosa-BA, te deixo essa mensagem...\n\n*NÃO VENDA O SEU VOTO...* Isso determinará os seus próximos 4 anos.\n\nEscolha uma pessoa capacitada que irá lutar por seus direitos e dos seus filhos, pensem neles...\n\nE eu sou o seu candidato onde irei trabalhar para que os nossos direitos sejam respeitados e concluídos.\n\nPense com carinho em quem irá votar, vamos tirar esses sugadores que nada fazem por nosso município.\n\nEles ficam cada vez mais ricos, não fazem nada, enquanto temos que ficar com as migalhas!"}, {quoted: message})
           console.log(`Enviados: ${i+1}/${numbers.length} delay: ${de} segundos`)
           //await client.sendMessage(njid, {text: `Enviados: ${i+1}/${numbers.length}`})
           await delay(de*1000)
         }
         await delay(2000)
         console.log("\nTerminado.")
         await client.sendMessage(njid, {text: "✅ Terminado."})
       } catch(e) {
         console.log(e)
         await client.sendMessage(njid, {text: "deu erro, veja os logs"})
         return
       }
}
        
        switch (cmd) {
          case "/enviar":
            podeUsar = isDono ? true : isVip ? false : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            massa(args, dono[0], 15)
            break;

            case "4":
                var result = {};
                result.text = "*\u260e\ufe0f Suporte:*\n\n" + dono2;
                var options = {};
                options.quoted = message;
                await client.sendMessage(jid, result);
                break;

            case "/menu":
            case "menu":
                /** @type {string} */
                boasvindas = "Seja Bem vindo(a) a *" + config.nomeLoja + "!* Fique a vontade para escolher alguma das op\u00e7\u00f5es abaixo:\n\n*[1]* Lista 📝\n*[2]* Comprar Internet 30 dias \ud83d\udcc6\n*[3]* Aplicativo \ud83d\udcf1\n*[4]* Suporte \ud83d\udc64";
                _getPageSource(boasvindas);
              reply ("Para ver est\u00e1 mensagem novamente, digite:\n\n*/menu*")
              break;

            case "2":
                /** @type {string} */
                placa2 = "*\u2022Informa\u00e7\u00f5es do produto\u2022*\n\n*\ud83c\udff7\ufe0fValor:* R$" + config.valorLogin + "\n*\ud83d\udcf2Limite:* 1\n*\u231bValidade:* 30 dias\n\n*Pix cel, Thierli, Nubank: 73999423092*";
                _getPageSource(placa2);
                await sleep(1200);
                await client.sendMessage(from, {
                  text: `⚠️ Após o pagamento me envie o comprovante, por gentileza!`});
                  break;
                

          case 'ajuda':
          case '/ajuda':
              await sleep(1200);
              return reply (`🎯 *Ótimo, irei te ajudar!*\n\n*1°:* Senha errada? Volte no app e verifique se tem algum espaço no final do seu usuário ou senha.\n\n*2°:* O App não conecta? Vai no grupo e veja o video pra LIMPAR DADOS E CACHES ou limpre se souber.\n\n*3°:* Verifique se seu saldo está bloqueado enviando um SMS com a palavra S para 8000.\n\n*4°:* NÃO ficar mais de 40 dias sem por créditos!\n\n_Sempre olhe o grupo!_\n_Espero ter ajudado._ 😁`)
        
          case 'iphone':
          case '/iphone':
              await sleep(1200);
              return reply(`*Logo abaixo está o Link do vídeo de como se conectar no iPhone.* 👇🏼\n\n📲 *Link:* https://www.mediafire.com/file/ocvy9smyyc5zvc9/video_iPhone.mp4/file`)

          case '/gb':
              await sleep(1000);
              reply("⌛️ Aguarde...\nEnviando o Link para baixar o WhatsApp GB!")
              await sleep(1500);
              return reply(`📲 Basta clicar no link abaixo para efetuar o Download: \n\nhttps://translate.google.com/website?sl=en&tl=fr&hl=en&client=webapp&u=https://apk-download.co/V993/GBWA9.93@FouadMODS.apk`)

          case "/imagine":
          case "imagine":
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args.length < 1) return reply("Quer gerar o quê?")
            reply("Aguarde... Demora uns 5seg!")
            fimagine(args, from, message)
            imagineFila.push(from) }
            catch (e) {
              console.log(e)
              reply("Não consigo gerar agora.")
            }
            break;

          case "/lista":
            case 'lista':
              case '1':
            await client.sendMessage(from, {
              text: `📱 *ILIMITHI COMANDOS* 📱\n\n*Consultas:*\n*/cpf* _(Consulta qlqr CPF)_\n*/cpf2* _(Consulta qlqr CPF)_\n*/nome* _(Consulta qlqr Nome)_\n*/tel* _(Consulta qlqr número)_\n\n*Baixar Vídeos:*\n*/insta* _(baixa Reels, Storys e fotos)_\n*/video* _(Baixa vídeos do Youtube)_\n*/tik* _(Baixa videos do TikTok)_\n*/face* _(Baixa video do Facebook)_\n\n*Baixar Músicas:*\n*/instaudio* _(Baixa aúdio do vidéo do Insta)_\n*/tikplay* _(Baixa aúdio do video Tiktok)_\n*/spot* _(Baixa música do Spotify)_\n*/sound* _(Baixa música do SoundCloud)_\n\n*Inteligência:*\n*/hd* _(ajeita a imagem para HD)_\n*/ia* _(Cvs c/ a inteligência)_\n*/imagine* _(cria qualquer imagem)_\n*/pop* _(Ver a população mundial)_\n*/ca* _(Calculadora)_\n*/ip* _(Consulta qualquer IP)_\n\n*Downloads:*\n*/gb* _(Envia link do WhatsAppGB)_\n*/apkfab* _(Baixa App's apkfab.com)_\n*/fire* _(Baixa Apk mediafire.com)_\n*/app* _(Envia o App de Internet)_\n*/ajuda* _(Ajuda conectar na Internet)_` });
              await sleep(1500);
              await client.sendMessage(from, {
                text: `⚠️ *Seja VIP e desfrute de todos esses comandos.*\n*Por apenas 20 reais mensais!*\n\n_Quer comprar?_\n_Me envie uma msg:_ ` + dono2 });
     
              break;

          case "/ia":
          case "ia":
            await sleep(1000);
            if(args < 1) return reply("digite alguma coisa depois de /ia")
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            reply("Digitando...")
            data = await fetchJson("https://vihangayt.me/tools/chatgpt2?q="+args)
            if(data || data.status) {
              return reply(data.data)
            } else if(!data || !data.status) {
              data = await fetchJson("https://vihangayt.me/tools/chatgpt3?q="+args)
              if(data || data.status) {
                return reply(data.data)
              } else if(!data || !data.status) {
                data = await fetchJson("https://vihangayt.me/tools/chatgptv4?q="+args)
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
            
          case "/hd":
            await sleep(1000);
          try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(isImage) {
              reply("Aguarde... Demora uns 10seg!")
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

          case "/play":
            await sleep(1000);
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args < 1) return reply("Qual o nome da música?")
            reply("Aguarde... Demora uns 10seg!")
            playData = await fetchJson("https://api.megah.tk/ytmp3?q="+encodeURI(args))
            playData = playData[0]
            await sleep(1500);
            playCap = `🔎 Fonte: ${playData.fonte}\n\n🕰️ Publicado: ${playData.publicado}\n👀 Views: ${playData.views}\n⌛ Duração: ${playData.duracao}\n\n🎵 Enviando sua música, aguarde...`
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

          case "/video":
          case "/vídeo":
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args < 1) return reply("Qual o nome do vídeo?")
            data = await fetchJson("https://vihangayt.me/download/ytmp4?url="+encodeURI(args))
            data = data.data
            await sleep(1500);
            playCap = `🔎 Fonte: youtube.com\n\n⌛ Duração: ${data.duration}\n\n▶️ Enviando seu vídeo, aguarde...`
            await client.sendMessage(from, {
              text: playCap,
              contextInfo: {
                expiration: sumir2,
                externalAdReply: {
                  title: data.title,
                  body: "ILIMITHI (box)",
                  thumbnailUrl: data.thumb,
                  mediaType: 1,
                  showAdAttribution: false,
                  renderLargerThumbnail: true
                }
              }
            }, {quoted: message})
            await client.sendMessage(from, {video: {url: data.vid_720p}, fileName: encodeURI(data.title)+".mp4", contextInfo: sumir, mimetype: "video/mp4"}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "deu erro", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro music 2")
            }
            break;

            case '/listavip':
              if(!isVip)return reply('📵 *ATENÇÃO:* Você não tem permissão!')
              vip = JSON.parse(fs.readFileSync("./vip.json"));
              console.log(args)
              await client.sendMessage(from, {
                text:"*USUÁRIOS ATIVOS:*\n\n"+vip})
                
                           
            break;

            case "/sound":
            await sleep(1000);
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args.length < 1) return reply("Coloque um link depois de /sound")
            if(!args.includes("soundcloud.com")) return reply("O link tem que ser da SoundCloud")
            reply("Aguarde... Demora uns 10seg!")
            data = await fetchJson("https://vihangayt.me/download/soundcloud?url="+encodeURI(args))
            data = data.data
            await sleep(1500);
            soundCap = `🔎 Fonte: SoundCloud\n\n📍 Título: ${data.title}\n🕰️ Downloads: ${data.download_count}\n\n🎵 Enviando sua música, aguarde...`
            await client.sendMessage(from, {
              text: soundCap,
              contextInfo: {
                expiration: sumir2,
                externalAdReply: {
                  title: data.title,
                  body: `ILIMITHI Bot`,
                  thumbnailUrl: data.thumb,
                  mediaType: 1,
                  showAdAttribution: false,
                  renderLargerThumbnail: true
                }
              }
            }, {quoted: message})
            await client.sendMessage(from, {audio: {url: data.link}, contextInfo: sumir, mimetype: "audio/mpeg"}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "deu erro", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro music 2")
            }
            break;

            case "/spot":
            await sleep(1000);
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args.length < 1) return reply("Coloque um link depois de /spot")
            if(!args.includes("spotify.com")) return reply("O link tem que ser da Spotify")
            reply("Aguarde... Demora uns 10seg!")
            data = await fetchJson("https://vihangayt.me/download/spotify?url="+encodeURI(args))
            data = data.data
            await sleep(1500);
            spotCap = `🔎 Fonte: Spotify\n\n🔉 Música: ${data.song}\n🎙 Artista: ${data.artist}\n⌛️ Publicado: ${data.release_date}\n📝 Álbum: ${data.album_name}\n\n🎵 Enviando sua música, aguarde...`
            await client.sendMessage(from, {
              text: spotCap,
              contextInfo: {
                expiration: sumir2,
                externalAdReply: {
                  title: data.song,
                  body: `ILIMITHI Bot`,
                  thumbnailUrl: data.cover_url,
                  mediaType: 1,
                  showAdAttribution: false,
                  renderLargerThumbnail: true
                }
              }
            }, {quoted: message})
            await client.sendMessage(from, {audio: {url: data.url}, contextInfo: sumir, mimetype: "audio/mpeg"}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "deu erro", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro music 2")
            }
            break;

            case "/tik":
            await sleep(1000);
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /tik")
              if(!args.includes("tiktok.com")) return reply("O link tem que ser do TikTok")
              reply("Aguarde... Baixando o Vídeo!")
              await sleep(1000);
              console.log(args)
              data = await fetchJson(`https://vihangayt.me/download/tiktok?url=${args}`)
              data = data.data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              tikTipo = data.status
              tikLink = data.links[0].a
              if(tikTipo == "ok") {
                return await client.sendMessage(from, {video: {url: tikLink}, mimetype:"video/mp4"})
              }
              else {
                return await client.sendMessage(from, {text: "Não identifiquei o tipo da mídia"})
              }
            } catch(e){
              console.log(e)
              reply("Deu erro")
            }
            break;

            case "/tikplay":
            await sleep(1000);
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /tik")
              if(!args.includes("tiktok.com")) return reply("O link tem que ser do TikTok")
              reply("Aguarde... Baixando o Áudio!")
              await sleep(1000);
              console.log(args)
              data = await fetchJson(`https://vihangayt.me/download/tiktok?url=${args}`)
              data = data.data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              tikTipo = data.status
              tikLink = data.links[0].a
              if(tikTipo == "ok") {
                return await client.sendMessage(from, {audio: {url: tikLink}, mimetype:"audio/mpeg"})
              }
              else {
                return await client.sendMessage(from, {text: "Não identifiquei o tipo da mídia"})
              }
            } catch(e){
              console.log(e)
              reply("Deu erro")
            }
            break;

            case "/face":
            await sleep(1000);
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /face")
              if(!args.includes("facebook.com")) return reply("O link tem que ser do Facebook")
              reply("Aguarde... Baixando o Vídeo!")
              console.log(args)
              data = await fetchJson(`https://vihangayt.me/download/fb2?url=${args}`)
              data = data.data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              faceFormat = data.media[0].format
              faceLink = data.media[0].url
              if(faceFormat == "mp4") {
                return await client.sendMessage(from, {video: {url: faceLink}, mimetype:"video/mp4"})
              }
              else {
                return await client.sendMessage(from, {text: "Não identifiquei o tipo da mídia"})
              }
            } catch(e){
              console.log(e)
              reply("Deu erro")
            }
            break;

            case "/apk":
            case "/app":
            case "apk":
            case "app":
            case "3":
            try {
             await client.sendMessage(from, {text: "📱 Enviando Aplicativo..."})
             await client.sendMessage(from, {document: {url: "./ILIMITHI.apk"}, mimetype: "application/vnd.android.package-archive", fileName: config.nomeApp+".apk", caption: "⚠️ *Instale o App, Copie o texto abaixo, abra o App e clique em IMPORTAR!*"}, {quoted: message})
             await sleep(3000);
             reply("vpn://ewogICAgImF1dGgiOiB7CiAgICAgICAgInBhc3N3b3JkIjogbnVsbCwKICAgICAgICAidXNlcm5hbWUiOiBudWxsLAogICAgICAgICJ2MnJheV91dWlkIjogbnVsbAogICAgfSwKICAgICJjYXRlZ29yeSI6IHsKICAgICAgICAiY29sb3IiOiAiI2E5MDdlNCIsCiAgICAgICAgImlkIjogIjE0NzUiLAogICAgICAgICJuYW1lIjogIlZJVk8iLAogICAgICAgICJzb3J0ZXIiOiAiMSIsCiAgICAgICAgInN0YXR1cyI6ICJBQ1RJVkUiLAogICAgICAgICJ1c2VyX2lkIjogIjM2NCIsCiAgICAgICAgImNyZWF0ZWRfYXQiOiAiMjAyMy0xMi0xOSAxNjoyNzozMyIsCiAgICAgICAgInVwZGF0ZWRfYXQiOiAiMjAyMy0xMi0xOSAxNjoyNzo1OCIKICAgIH0sCiAgICAiY2F0ZWdvcnlfaWQiOiAiMTQ3NSIsCiAgICAiY29uZmlnX29wZW52cG4iOiBudWxsLAogICAgImNvbmZpZ19wYXlsb2FkIjogewogICAgICAgICJwYXlsb2FkIjogIltkZWxheV9zcGxpdF1CQ09QWSAvIFtjcmxmXVtjcmxmXSIsCiAgICAgICAgInNuaSI6ICIiCiAgICB9LAogICAgImNvbmZpZ192MnJheSI6IG51bGwsCiAgICAiZGVzY3JpcHRpb24iOiAiVml2byBEaXJlY3QiLAogICAgImRuc19zZXJ2ZXIiOiB7CiAgICAgICAgImRuczEiOiAiMS4xLjEuMSIsCiAgICAgICAgImRuczIiOiAiMS4wLjAuMSIKICAgIH0sCiAgICAiaWNvbiI6ICJodHRwczovL2kuaWJiLmNvL0R6a3A1bVYvNDg3ZjdiMjJmNjgzMTJkMmMxYmJjOTNiMWFlYTQ0NWItMTY5OTQ2NDM0Mjk4My5wbmciLAogICAgImlkIjogIjE2MjY5IiwKICAgICJtb2RlIjogIlNTSF9QUk9YWSIsCiAgICAibmFtZSI6ICJWSVZPIERFTEFZIiwKICAgICJwcm94eSI6IHsKICAgICAgICAiaG9zdCI6ICJici5pbGltaXRoaS5zaG9wIiwKICAgICAgICAicG9ydCI6ICI4MCIKICAgIH0sCiAgICAic2VydmVyIjogewogICAgICAgICJob3N0IjogImJyLmlsaW1pdGhpLnNob3AiLAogICAgICAgICJwb3J0IjogIjgwIgogICAgfSwKICAgICJzb3J0ZXIiOiAiMSIsCiAgICAic3RhdHVzIjogIkFDVElWRSIsCiAgICAidGxzX3ZlcnNpb24iOiAiVExTdjEuMyIsCiAgICAidWRwX3BvcnRzIjogWwogICAgICAgIDczMDAsCiAgICAgICAgNzEwMCwKICAgICAgICA3NjAwLAogICAgICAgIDc3MDAsCiAgICAgICAgNzQwMCwKICAgICAgICA3NTAwLAogICAgICAgIDcyOTksCiAgICAgICAgNzI5OAogICAgXSwKICAgICJ1cmxfY2hlY2tfdXNlciI6ICJodHRwOi8vZ2Rob3N0LnNwYWNlL2FwaS9ici5pbGltaXRoaS5zaG9wOjUwMDAiLAogICAgImNyZWF0ZWRfYXQiOiAiMjAyMy0xMi0xOSAxNjozMTozMiIsCiAgICAidXBkYXRlZF9hdCI6ICIyMDIzLTEyLTE5IDE2OjUyOjUxIiwKICAgICJ1c2VyX2lkIjogIkc5QzFMNFdPLTk1UzMtU0QyTS03WU5CLVhTMFVDMjdLSU5aNiIKfQ==")
            }
            catch (e) {   
              await client.sendMessage(from, {text: "deu erro"})
              console.log(e)
            }
            break;

            case "/apkfab":
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /apkfab")
              if(!args.includes("apkfab.com")) return reply("O link tem que ser do apkfab.com")
            data = await fetchJson("https://vihangayt.me/download/apkfab?url="+encodeURI(args))
            data = data.data
            await sleep(1500);
            fabCap = `🔎 Fonte: APK FAB\n\n📝 Titulo: ${data.title}\n📎 Tamanho: ${data.size}\n\n⌛️ Enviando o arquivo, aguarde...`
            await client.sendMessage(from, {text: fabCap})
            await client.sendMessage(from, {document: {url: data.link}, fileName: data.title+".apk", mimetype: "application/vnd.android.package-archive", caption: "📲 *Basta instalar e aproveitar o seu APP.*"}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "deu erro", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro music 2")
            }
            break;

            case "/fire":
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /fire")
              if(!args.includes("mediafire.com")) return reply("O link tem que ser do mediafire")
            data = await fetchJson("https://vihangayt.me/download/mediafire?url="+encodeURI(args))
            data = data.data
            await sleep(1500);
            fireCap = `🔎 Fonte: MediaFire\n\n📝 Titulo: ${data.name}\n📎 Tamanho: ${data.size}\n🗓 Data: ${data.date}\n\n⌛️ Enviando o arquivo, aguarde...`
            await client.sendMessage(from, {text: fireCap})
            await client.sendMessage(from, {document: {url: data.link}, fileName: data.name+".apk", mimetype: "application/vnd.android.package-archive", caption: "📲 *Basta instalar e aproveitar o seu APP.*"}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "deu erro", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro music 2")
            }
            break;

            case "/calc":
            case "calc":
            case "ca":
            case "/ca":
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              console.log(args)
              data = await fetchJson(`https://vihangayt.me/tools/mathssolve?q=${args}`)
              data = data.data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              calcLink = data
              calcCap = `*Resultado:* ${data}`
              reply(calcCap)
            }
            catch (e) {   
              await client.sendMessage(from, {text: "deu erro"})
              console.log(e)
            }
            break;

            case "/ip":
            await sleep(1000);
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              console.log(args)
              data = await fetchJson(`https://vihangayt.me/stalk/ip?q=${args}`)
              data = data.data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              ipLink = data.status
              ipCap = `🔎 *Fonte:* Stalp IP\n\n📝 *IP:* ${data.ip}\n🛤 *Continente:* ${data.continent}\n⛰ *País:* ${data.country}\n📬 *Código:* ${data.countryCode}\n📊 *Região:* ${data.regionName}\n🏘 *Cidade:* ${data.city}\n📍 *Cep:* ${data.zip}\n📩 *Zona:* ${data.timezone}\n💰 *Moeda:* ${data.currency}\n📲 *Mobile:* ${data.mobile}\n📚 *Proxy:* ${data.proxy}\n🎯 *Hosting:* ${data.hosting}\n🔖 *ISP:* ${data.isp}\n🔗 *ORG:* ${data.org}\n📎 *Cache:* ${data.cached}`
              reply(ipCap)
            }
            catch (e) {   
              await client.sendMessage(from, {text: "deu erro"})
              console.log(e)
            }
            break;

            case "/pop":
            await sleep(1000);
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              console.log(args)
              data = await fetchJson(`https://vihangayt.me/details/population?q=${args}`)
              data = data.data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              popLink = data.current
              popLink1 = data.this_year
              popLink2 = data.today
              ipCap = `🔎 *Fonte:* População Mundial\n\n🌎 _Total:_ ${popLink.total} bi\n🧔‍♂️ _Homens:_ ${popLink.male} bi\n👩 _Mulheres:_ ${popLink.female} bi\n\n🗓 *Este Ano:*\n👶 _Nascimentos:_ ${popLink1.births}\n💀 _Mortes:_ ${popLink1.deaths}\n\n🗓 *Hoje:*\n👶 _Nascimentos:_ ${popLink2.births}\n💀 _Mortes:_ ${popLink2.deaths}`
              reply(ipCap)
            }
            catch (e) {   
              await client.sendMessage(from, {text: "deu erro"})
              console.log(e)
            }
            break;

            case "/nasa":
              await sleep(1000);
              try {
                podeUsar = isDono ? true : isVip ? true : false
                if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
                console.log(args)
                data = await fetchJson(`https://vihangayt.me/details/nasa?q=${args}`)
                data = data.data
                //console.log(data)
                if(!data) return reply("Deu erro na api")
                nasaLink = data.title
                nasaCap = `🔎 *Fonte:* _NASA_\n\n*Titulo:* ${data.title}\n*Data:* ${data.date}\n\n*Explicação:* ${data.explanation}`
                reply(nasaCap)
              }
              catch (e) {   
                await client.sendMessage(from, {text: "deu erro"})
                console.log(e)
              }
              break;
 
            case "/insta":
            await sleep(1000);
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /insta")
              if(!args.includes("instagram.com")) return reply("O link tem que ser do instagram")
              reply("Aguarde... Baixando o Vídeo/Imagem!")
              console.log(args)
              data = await fetchJson(`https://vihangayt.me/download/instagram?url=${args}`)
              data = data.data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              instaTipo = data.data[0].type
              instaLink = data.data[0].url
              if(instaTipo == "video") {
                return await client.sendMessage(from, {video: {url: instaLink}, mimetype:"video/mp4"})
              } else if(instaTipo == "image") {
                return await client.sendMessage(from, {image: {url: instaLink}})
              } else {
                return await client.sendMessage(from, {text: "Não identifiquei o tipo da mídia"})
              }
            } catch(e){
              console.log(e)
              reply("Deu erro")
            }
            break;

            case "/instaudio":
            await sleep(1000);
            try {
              podeUsar = isDono ? true : isVip ? true : false
              if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
              if(args.length < 1) return reply("Coloque um link depois de /insta")
              if(!args.includes("instagram.com")) return reply("O link tem que ser do instagram")
              reply("Aguarde... Baixando o Áudio!")
              console.log(args)
              data = await fetchJson(`https://vihangayt.me/download/instagram?url=${args}`)
              data = data.data
              //console.log(data)
              if(!data) return reply("Deu erro na api")
              instaTipo = data.data[0].type
              instaLink = data.data[0].url
              if(instaTipo == "video") {
                return await client.sendMessage(from, {audio: {url: instaLink}, mimetype:"audio/mpeg"})
              } else {
                return await client.sendMessage(from, {text: "Não identifiquei o tipo da mídia"})
              }
            } catch(e){
              console.log(e)
              reply("Deu erro")
            }
            break;

         
          case '/pix':
          const value = parseFloat(q);
          await client.sendMessage(from, {
              text: `💸 *ILIMITHI 5G  -  Pagamentos* 💸\n\n_Valor a pagar está correto? (confirme antes)_\n\n*Efetue o pagamento no valor de R$30,00 usando o PIX Copia e Cola abaixo:* 👇 
        ` });
        function sleep(milliseconds) {
          return new Promise(resolve => setTimeout(resolve, milliseconds))
      }
        await sleep(2000);
        await client.sendMessage(from, {
          text: `00020126470014br.gov.bcb.pix0125thierli_souza@hotmail.com5204000053039865802BR5922Thierli de Souza Ramos6008Brasilia62080504mpda63044E44` });
          await sleep(1500);
          await client.sendMessage(from, {
              text: `⚠️ *Após pagar, me envie o comprovante por gentileza.* ⚠️`});
          break;

          case 'horas':
          case '/horas':
          case 'hr':
          case '/hr':
            await sleep(1500);
            if(args < 1) return reply(`⏰ São ${dataAtual.getHours()}h e ${dataAtual.getMinutes()} minutos.`)
        break;

        case '/data':
          await sleep(1500);
          if(args < 1) return reply(`🗓 Hoje é dia ${dataAtual.getDate()}/${(dataAtual.getMonth() + 1)} de ${dataAtual.getFullYear()}`)
        break;
     
          case "/addvip":
            if(!isDono) return reply("🔐 Apenas meu dono pode usar!")
            if(args < 1) return reply("Cadê o número?")
            vip = JSON.parse(fs.readFileSync("./vip.json"));
            args = args.replaceAll("+","").replaceAll(" ","").replaceAll("-","")
            console.log(args)
            if(vip.includes(args)) return reply("Essa pessoa já é vip. 🫡")
            vip.push(args)
            await fs.writeFileSync("./vip.json", JSON.stringify(vip, null, 2))
            reply("Adicionado com sucesso!")
            break;
          case "/delvip":
            if(!isDono) return reply("🔐 Apenas meu dono pode usar esse comando!")
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

          case "/cpf":
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args < 1) return reply("🤔 Cadê o CPF?")
            reply("🔎 Aguarde... Estou buscando!")
            await sleep(2000);
            cpfData = await fetchJson(`https://apicpf.megah.tk/cpf.php?token=boxprem&consulta=${args}`)
            if(cpfData.status == 404) return await client.sendMessage(from, {text: "❌ Não foi encontrado informações para o CPF informado.", contextInfo: sumir}, {quoted: message})
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
            cpfText = `🔎 Consulta De CPF

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
              console.log("Deu erro no CPF")
            }
            break;

          case "/tel":
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args < 1) return reply("🤔 Cadê o Número?")
            reply("🔎 Aguarde... Estou buscando!")
            await sleep(2000);
            telData = await fetchJson(`http://api2.minerdapifoda.xyz:8080/api/telefones2?telefone=${args}`)
            telData = telData.Resultado
            tabelas = Object.keys(telData).map(i => telData[i])
            tabela1 = tabelas[0][0]
            tabela2 = tabelas[1][0]
            tabela3 = tabelas[2][0]
            console.log(telData.Resultado)
            
            telNum = ""
            if(telData.telefone > 0) {
              for (tels of telData.telefone) {
                telNum += tels+"\n"
              }
            } else {
              telNum += "Sem informação\n"
            }
            //console.log(cpfData)
            telText = `🔎 𝘾𝒐𝙣𝒔𝙪𝒍𝙩𝒂 𝑫𝙚 𝙏𝒆𝙡𝒆𝙛𝒐𝙣𝒆

[👨🏽‍💻] *Telefone Informado:* ${tabela1.telefone}

📌 𝑫𝙖𝒅𝙤𝒔 𝑬𝙣𝒄𝙤𝒏𝙩𝒓𝙖𝒅𝙤𝒔 📌

▸ *Nome:* ${tabela1.nome}
▸ *CPF:* ${tabela1.cpf}
▸ *Tipo de Pessoa:* ${tabela1.TIPO_PESSOA}
▸ *Data Instalação:* ${tabela1.DATA_INSTALACAO}
▸ *Telefone Secundário:* ${tabela1.telefone_sec}

▸ *Telefones:*\n${tabela1.telefone}

🏠 𝙀𝒏𝙙𝒆𝙧𝒆𝙘̧𝒐 𝑽𝙞𝒏𝙘𝒖𝙡𝒂𝙙𝒐 🏠

▸ *Rua:* ${tabela2.rua}
▸ *Bairro:* ${tabela2.bairro}
▸ *Número:* ${tabela2.num}
▸ *Complemento:* ${tabela2.compl}
▸ *Cep:* ${tabela2.cep}

🏡 𝑳𝙤𝒄𝙖𝒍 𝒅𝙚 𝙉𝒂𝙨𝒄𝙞𝒎𝙚𝒏𝙩𝒐 🏡
 
▸ *UF:* ${tabela2.uf}
`
await client.sendMessage(from, {text: telText, contextInfo: sumir}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "❌ Não foi encontrado informações para o número informado.", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro no Numero")
            }
            break;

          case "/cpf2":
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args < 1) return reply("🤔 Cadê o CPF?")
            reply("🔎 Aguarde... Estou buscando!")
            await sleep(2000);
            cpf2Data = await fetchJson(`http://api2.minerdapifoda.xyz:8080/api/cpf3?cpf=${args}`)
            cpf2Data = cpf2Data.Resultado
            console.log(cpf2Data.Resultado)

            await client.sendMessage(from, {text: cpf2Data, contextInfo: sumir}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "❌ Não foi encontrado informações para o CPF informado.", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro no CPF")
            }
            break;

            case "/rg":
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args < 1) return reply("🤔 Cadê o RG?")
            reply("🔎 Aguarde... Estou buscando!")
            await sleep(2000);
            rgData = await fetchJson(`http://api2.minerdapifoda.xyz:8080/api/rg?rg=${args}`)
            rgData = rgData.Resultado
            tabelas = Object.keys(rgData).map(i => rgData[i])
            rg1 = tabelas[0][0]
            console.log(rg1.Resultado)

            //console.log(cpfData)
            rgText = `🔎 𝘾𝒐𝙣𝒔𝙪𝒍𝙩𝒂 𝑫𝙚 𝙏𝒆𝙡𝒆𝙛𝒐𝙣𝒆

[👨🏽‍💻] *RG Informado:* ${rg1.rg}

📌 𝑫𝙖𝒅𝙤𝒔 𝑬𝙣𝒄𝙤𝒏𝙩𝒓𝙖𝒅𝙤𝒔 📌

▸ *Cpf:* ${rg1.cpf}
▸ *Cns:* ${rg1.cns}
▸ *Nome:* ${rg1.nome}
▸ *Data De Nascimento:* ${rg1.nascimento}
▸ *Sexo:* ${rg1.sexo}
▸ *Cor:* ${rg1.raca_cor}
▸ *Falecido:* ${rg1.falecido}
▸ *Mãe:* ${rg1.mae}
▸ *Pai:* ${rg1.pai}
▸ *Telefone:* ${rg1.celular}
▸ *Email:* ${rg1.email}
▸ *RG:* ${rg1.rg}
▸ *Oragão Emissor:* ${rg1.rg_orgao_emissor}
▸ *Data Emissão:* ${rg1.rg_data_emissao}

「🏠」 *Endereço Vinculado*「🏠」

▸ *Rua:* ${rg1.rua}
▸ *Número:* ${rg1.numero}
▸ *Bairro:* ${rg1.bairro}
▸ *Cidade:* ${rg1.cidade}
▸ *Estado:* ${rg1.estado}
▸ *Cep:* ${rg1.cep} 
`

            await client.sendMessage(from, {text: rgText, contextInfo: sumir}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "❌ Não foi encontrado informações para o RG informado.", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro no RG")
            }
            break;

          case "/nome":
            try {
            podeUsar = isDono ? true : isVip ? true : false
            if(!podeUsar) return reply("🔐 Apenas pessoas autorizadas podem usar!")
            if(args < 1) return reply("🤔 Cadê o Nome?")
            reply("🔎 Aguarde... Estou buscando!")
            await sleep(2000);
            nomeData = await fetchJson(`http://api2.minerdapifoda.xyz:8080/api/nomes?nome=${args}`)
            nomeData = nomeData.Resultado
            console.log(nomeData.Resultado)

await client.sendMessage(from, {text: nomeData, contextInfo: sumir}, {quoted: message})
            } catch (e) {
              await client.sendMessage(from, {text: "❌ Não foi encontrado informações para o nome informado.", contextInfo: sumir}, {quoted: message})
              console.log(e)
              console.log("Deu erro no nome")
            }
            break;
 
          case "/tempo":
            tempOn2 = pms(Date.now()-tempOn)
            console.log(tempOn2)
            plaq4 = `*Tempo Online*\n\n*Dias*: ${tempOn2.days}\n*Horas*: ${tempOn2.hours}\n*Minutos*: ${tempOn2.minutes}\n*Segundos*: ${tempOn2.seconds}`
            reply(plaq4)
            break;
          case "restart":
          case "res":
          case "/res":
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
