//variaveis do jogo
var canvas,ctx,ALTURA,LARGURA,frames = 0, 
maxPulo = 3, velocidade = 6, estadoAtual,record,

estados = {
	jogar: 0,
	jogando:1,
	perdeu:2
},




chao = {
	y: 550,
	altura: 50,
	cor:"#ffdf70",
	desenha:function() {
		ctx.fillStyle = this.cor;
		ctx.fillRect(0,this.y,LARGURA,this.altura);
	}
},

//Variaveis do bloco
bloco = {
	x:50,
	y:0,
	altura:50,
	largura:50,
	cor:"#ff4e4e",
	gravidade:10.6,
	velocidade:0,
	forcaDoPulo: 20.6 ,
	qntPulos: 0,
	score:0,

	//Função que atualiza o jogo
	atualiza:function(){		
		bloco.y += bloco.gravidade;		
		bloco.x += bloco.velocidade;
		if (this.y > chao.y - this.altura && estadoAtual != estados.perdeu) {
			this.y = chao.y - this.altura;
			this.qntPulos = 0;
			this.gravidade = 0;
		}
		if (bloco.y < chao.y - bloco.altura)
			bloco.gravidade += 1;
	},
	//Função parar
	parar:function(){
		bloco.velocidade = 0;					
	},
	//Função pra frente
	andarFrente: function(){
		bloco.velocidade = 5;					
	},
	//Função pra tras
	andarTras:function(){
		bloco.velocidade = -5;					
	},
	//Função de pular
	pula:function(){
		//if (this.qntPulos < maxPulo) {
			this.gravidade = -this.forcaDoPulo;
			
			//this.qntPulos++;
		//}
	},

	//Função de recomeçar o jogo
	reset: function(){
		this.velocidade = 0;
		this.y = 0;

		if (this.score > record) {
			localStorage.setItem("record", this.score);
			record = this.score;
		}

		this.score = 0;
	},

	//Função que desenha
	desenha:function(){
		ctx.fillStyle = this.cor;
		ctx.fillRect(this.x,this.y,this.largura,this.altura);
	}
},

obstaculos = {
	//Array de objetos
	_obs: [],

	cores: ["#ffbc1c","#ff1c1c","#ff85e1","#52a7ff","#78ff5d"],
	tempoInsere: 0,

	//Função que insere o objeto no jogo
	insere:function(){
		this._obs.push({
			x:LARGURA,
			//largura: 30 + Math.floor(21 * Math.random()),
			largura: 50,
			altura: 30 + Math.floor(120 * Math.random()),
			cor: this.cores[Math.floor(5 * Math.random())],
		});
		this.tempoInsere = 30 + Math.floor(20 * Math.random());
	},
	//Função para atualizar os objetos na tela
	atualiza:function(){
		if (this.tempoInsere == 0) {
			this.insere();
		}else{
			this.tempoInsere--;
		}
		for (var i = 0, tam = this._obs.length; i < tam; i++) {
			var obs = this._obs[i];

			obs.x -= velocidade;

			if (bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >= obs.x && bloco.y + bloco.altura >= chao.y - obs.altura) {
				estadoAtual = estados.perdeu;
			}else if (obs.x == 0) {
				bloco.score++;
			}else if (obs.x <= -obs.largura) {
				this._obs.splice(i,1);
				tam--;
				i--;
			}
		}
	},

	// Função para limpar o Array de objetos quando eles sairem da tela
	limpa:function(){
		this._obs = [];
	},

	//Fução de desenhar os objetos na tela
	desenha:function(){
		for (var i = 0, tam = this._obs.length; i < tam; i++) {
			 var obs = this._obs[i];
			 ctx.fillStyle = obs.cor;
			 ctx.fillRect(obs.x, chao.y - obs.altura, obs.largura, obs.altura);
		}
	}
};

//Função do clique 
function click(evt) {
	if (estadoAtual == estados.jogando) {	
		$("#setaCima").click(function(){			
			bloco.pula();
		});
		$("#setaFrente").click(function(){			
			bloco.andarFrente();
		});
		$("#setaTras").click(function(){			
			bloco.andarTras();
		});		
	}else if (estadoAtual == estados.jogar
		) {
		estadoAtual = estados.jogando;
	}else if (estadoAtual == estados.perdeu && bloco.y >= 2 * ALTURA) {
		estadoAtual = estados.jogar;
		obstaculos.limpa();
		bloco.reset();
	}
	
}

//Função do mouse pressionado
function hold(evt) {
	if (estadoAtual == estados.jogando) {			
		$("#setaFrente").hold(function(){			
			bloco.parar();
		});
		$("#setaTras").hold(function(){			
			bloco.parar();
		});
			
	}else if (estadoAtual == estados.jogar
		) {
		estadoAtual = estados.jogando;
	}else if (estadoAtual == estados.perdeu && bloco.y >= 2 * ALTURA) {
		estadoAtual = estados.jogar;
		obstaculos.limpa();
		bloco.reset();
	}
	
}

//Função principal do jogo, é nela que o gameLoop se encontra
function main() {
	ALTURA = window.innerHeight;
	LARGURA = window.innerWidth;
	
	if (LARGURA >= 500 ) {
		LARGURA = 600;
		ALTURA = 600;
	}

	canvas = document.createElement("canvas");
	canvas.width = LARGURA;
	canvas.height = ALTURA;
	canvas.style.border = "1px solid #000";

	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	document.addEventListener("mousedown",click);
	document.addEventListener("mouseup",hold);
	estadoAtual = estados.jogar;
	record = localStorage.getItem("record"); 

	if (record == null) {
		record = 0;
	}

	jogo();

}

//Função responsavel pelo controle do jogo
function jogo() {
	atualiza();
	desenha();

	window.requestAnimationFrame(jogo);
}

//Função que atualiza o jogo
function atualiza() {
	frames++;
	bloco.atualiza();
	if (estadoAtual == estados.jogando) {
		obstaculos.atualiza();
	}
}

// Função que desenha tudo que é visto pelo usuario
function desenha() {
	ctx.fillStyle = "#50beff";
	ctx.fillRect(0,0,LARGURA,ALTURA);

	ctx.fillStyle = "#fff";
	ctx.font = "50px Arial";
	ctx.fillText(bloco.score,30,70);

	if (estadoAtual == estados.jogar) {
		ctx.fillStyle = "green";
		ctx.fillRect(LARGURA/2 - 50, ALTURA/2 - 50, 100,100);
	}else if (estadoAtual == estados.perdeu) {
		ctx.fillStyle = "red";
		ctx.fillRect(LARGURA/2 - 50, ALTURA/2 - 50, 100,100);
		ctx.save();
		ctx.translate(LARGURA / 2, ALTURA /2);
		ctx.fillStyle = "#fff";

		if (bloco.score > record) {
			ctx.fillText("Novo Record!", -150,-65)
		}else if (record < 10){
			ctx.fillText("Record " + record, -99, -65);
		}else if (record >= 10 && record < 100) {
			ctx.fillText("Record" + record, -112,-65);
		}else{
			ctx.fillText("Record" + record, -125, -65);
		}

		if (bloco.score < 10) {
			ctx.fillText(bloco.score,-13,19);
		}else if (bloco.score >= 10 && bloco.score< 100) {
			ctx.fillText(bloco.score,-28,19);
		}else{
			ctx.fillText(bloco.score, -39,19);
		}
		ctx.restore();
	}else if (estadoAtual == estados.jogando){
		obstaculos.desenha();
	}
	chao.desenha();	
	bloco.desenha();
}

//inicializa o jogo
main();