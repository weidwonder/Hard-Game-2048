var board2048=$("#board2048");
var Matrix=[
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0]
];
var MatrixBackup=[
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0],
	[0,0,0,0]
];
var score=0;
var currentScore=0;
var up=0,down=1,left=2,right=3,MIN_VALUE=-500;
var failed=false;
var situationJudge=0;
//文档初始化-------------------------------
$(document).ready(function(){
	beginGame();
});

//开始游戏
var beginGame=function(){
	Matrix[1][1]=2;
	Matrix[3][3]=2;
	initChessBoard();
	display();
};

//重新开始
var resetGame=function(){
	for (var i = 0; i < Matrix.length; i++) {
		for (var j = 0; j < Matrix[0].length; j++) {
			Matrix[i][j]=0;
		};
	};
	backup();
	score=0;
	currentScore=0;
	failed=false;
	Matrix[1][1]=2;
	Matrix[3][3]=2;
	display();
}

var genCell=function(id){
	return '<div class="colored squre cell" id="'+id+'"><div class="centerCell font"></div></div>';
};

//初始化棋盘
var initChessBoard=function(){
	for (var i = 0; i < Matrix.length; i++) {
		for (var j = 0; j < Matrix[0].length; j++) {
			board2048.append(genCell(""+i+j));
		};
	};
};

var display=function(){
	for (var i = 0; i < Matrix.length; i++) {
		for (var j = 0; j < Matrix[0].length; j++) {
			if(Matrix[i][j]!=MatrixBackup[i][j]){
				$("#"+i+j+" div").hide();
			}
				$("#"+i+j+" div").text("");
				$("#"+i+j+" div").css("background-color",getColor(Matrix[i][j]));
				if (Matrix[i][j]!=0) {
					$("#"+i+j+" div").text(""+Matrix[i][j]);
				};
			if(Matrix[i][j]!=MatrixBackup[i][j]){
				$("#"+i+j+" div").fadeIn();
			}
		};
	};
	$("#score").text(score);
	$("#situation").text(situationJudge);
};
//移动函数
//参数:方向
var move=function(direction){
	var temp=new Array(Matrix.length);
	switch (direction) {
	case up:
		for (var i = 0; i < Matrix[0].length; i++) {
			for (var j = 0; j < Matrix.length; j++) {
				temp[j]=Matrix[j][i];
			}
			temp=merge(temp);
			for (var j = 0; j < Matrix.length; j++) {
				Matrix[j][i]=temp[j];
			}
		}
		break;
	case down:
		for (var i = 0; i < Matrix[0].length; i++) {
			for (var j = 0; j < Matrix.length; j++) {
				temp[Matrix[0].length-j-1]=Matrix[j][i];
			}
			temp=merge(temp);
			for (var j = 0; j < Matrix[0].length; j++) {
				Matrix[j][i]=temp[Matrix[0].length-j-1];
			}
		}
		break;
	case left:
		for (var i = 0; i < Matrix.length; i++) {
			for (var j = 0; j < Matrix[0].length; j++) {
				temp[j]=Matrix[i][j];
			}
			temp=merge(temp);
			for (var j = 0; j < Matrix[0].length; j++) {
				Matrix[i][j]=temp[j];
			}
		}
		break;
	case right:
		for (var i = 0; i < Matrix.length; i++) {
			for (var j = 0; j < Matrix[0].length; j++) {
				temp[Matrix[0].length-j-1]=Matrix[i][j];
			}
			temp=merge(temp);
			for (var j = 0; j < Matrix[0].length; j++) {
				Matrix[i][j]=temp[Matrix[0].length-j-1];
			}
		}
		break;
	default:
		break;
	}
	if (isSame()) {
		return false;
	}
	return true;
};

//合并单排数组函数
var merge=function(temp){
	var current=0;
		var lastLoc=0;
		for (var i = 0; i < temp.length; i++) {
			if(temp[i]==0)continue;
			if(current==0){
				current=temp[i];
				lastLoc=i;
				continue;
			}
			if(temp[i]==current){
				temp[lastLoc]*=2;
				currentScore+=temp[lastLoc];
				temp[i]=0;
				current=0;
				lastLoc=i+1;
			}
			current=temp[i];
			lastLoc=i;
		}
		var loc=0;
		var retArray=new Array(temp.length);
		for (var i = 0; i < temp.length; i++) {
			if(temp[i]!=0){
				retArray[loc]=temp[i];
				loc++;
			}
		}
		for (var i = loc; i < retArray.length; i++) {
			retArray[i]=0;
		}
		return retArray;
};

//矩阵比较
var isSame=function(){
	for (var i = 0; i < Matrix.length; i++) {
		for (var j = 0; j < Matrix[0].length; j++) {
			if(Matrix[i][j]!=MatrixBackup[i][j])return false;
		}
	}
	return true;
};

//生成新点函数
var newDot=function(){
	var biggestPolar=MIN_VALUE;
	var coordinate=[0,0,2];
	var temPolar=0;
	for (var i = 0; i < Matrix.length; i++) {
		for (var j = 0; j < Matrix[0].length; j++) {
			if (Matrix[i][j]==0) {
				temPolar=minPolar(i, j, 2);
							//alert(biggestPolar<temPolar);
				if(biggestPolar<temPolar){
					coordinate=[i,j,2];
					biggestPolar=temPolar;
				}
				temPolar=minPolar(i, j, 4);
				if(biggestPolar<temPolar){
					coordinate=[i,j,4];
					biggestPolar=temPolar;
				}
			}
		}
	}
	situationJudge=biggestPolar;
	Matrix[coordinate[0]][coordinate[1]]=coordinate[2];
};

//求投放某点之后四个方向的的最小极性值
var minPolar=function(coordinateX,coordinateY,num){
	var minPolar=Number.MAX_VALUE;
		var polar=0;
		backup();
		Matrix[coordinateX][coordinateY]=num;
		if(move(up)){
			polar=calculatePolar();
			polar-=mergePolarRevise();
		} else{
			polar=Number.MAX_VALUE;
		}
		minPolar=Math.min(polar,minPolar);
		unBackup();
		Matrix[coordinateX][coordinateY]=num;
		if(move(down)){
			polar=calculatePolar();
			polar-=mergePolarRevise();
		} else{
			polar=Number.MAX_VALUE;
		}
		minPolar=Math.min(polar,minPolar);
		unBackup();
		Matrix[coordinateX][coordinateY]=num;
		if(move(left)){
			polar=calculatePolar();
			polar-=mergePolarRevise();
		} else{
			polar=Number.MAX_VALUE;
		}
		minPolar=Math.min(polar,minPolar);
		unBackup();
		Matrix[coordinateX][coordinateY]=num;
		if(move(right)){
			polar=calculatePolar();
			polar-=mergePolarRevise();
		} else{
			polar=Number.MAX_VALUE;
		}
		minPolar=Math.min(polar,minPolar);
		unBackup();
		return minPolar;
};

//单格极性运算.
var cellPolar=function(a,b){
	if(a*b==0){
		a=Math.max(a,b);
		if(a<=8)return 1;
		else return getLog2(a)-3;
	}
	a=getLog2(a);
	b=getLog2(b);
	return Math.abs(a-b);
};

//极性对应表
var getLog2=function(x){
	switch (x) {
		case 0:
			return 0;
		case 2:
			return 1;
		case 4:
			return 2;
		case 8:
			return 3;
		case 16:
			return 4;
		case 32:
			return 5;
		case 64:
			return 6;
		case 128:
			return 7;
		case 256:
			return 8;
		case 512:
			return 9;
		case 1024:
			return 10;
		case 2048:
			return 11;
		case 4096:
			return 12;
		case 8192:
			return 13;
		case 16384:
			return 14;
		default:
			return 15;
		}
};

//颜色对应表
var getColor=function(x){
	switch (x) {
		case 0:
			return "#AFCF9D";
		case 2:
			return "rgb(68, 244, 40)";
		case 4:
			return "rgb(141, 239, 36)";
		case 8:
			return "rgb(139, 213, 30)";
		case 16:
			return "rgb(166, 199, 46)";
		case 32:
			return "rgb(236, 219, 52)";
		case 64:
			return "rgb(43, 224, 183)";
		case 128:
			return "rgb(17, 159, 184)";
		case 256:
			return "rgb(244, 162, 54)";
		case 512:
			return "rgb(244, 126, 54)";
		case 1024:
			return "rgb(244, 83, 54)";
		case 2048:
			return "rgb(247, 30, 30)";
		case 4096:
			return "rgb(221, 31, 103)";
		case 8192:
			return "rgb(195, 6, 128)";
		case 16384:
			return "rgb(140, 4, 113)";
		default:
			return "#000";
		}
};

//极性值算法
var calculatePolar=function(){
	var sum=0;
	for (var i = 0; i < Matrix.length-1; i++) {
		for (var j = 0; j < Matrix.length; j++) {
			sum+=cellPolar(Matrix[i][j], Matrix[i+1][j])-1;
		}
	}
	for (var i = 0; i < Matrix.length; i++) {
		for (var j = 0; j < Matrix.length-1; j++) {
			sum+=cellPolar(Matrix[i][j], Matrix[i][j+1])-1;
		}
	}
	return sum;
};

//合并修正----------------------------------------------
var mergePolarRevise=function(){
	var goal=parseInt(currentScore).toString(2);
	var total=0;
	for (var i = goal.length - 1; i >= 0; i--) {
		if(goal.charAt(i)=='1')total+=(goal.length-i);
	};
	return total;
};

//获取矩阵中最大值
var getMatrixMax=function(Matrix){
	var max=0;
	for (var i = 0; i < Matrix.length; i++) {
		for (var j = 0; j < Matrix[0].length; j++) {
			if(max<Matrix[i][j])max=Matrix[i][j];
		};
	};
	return max;
};

//备份函数
var backup=function(){
	for (var i = 0; i < Matrix.length; i++) {
		for (var j = 0; j < Matrix.length; j++) {
			MatrixBackup[i][j]=Matrix[i][j];
		}
	}
};

//恢复函数
var unBackup=function(){
	for (var i = 0; i < Matrix.length; i++) {
		for (var j = 0; j < Matrix.length; j++) {
			Matrix[i][j]=MatrixBackup[i][j];
		}
	}
	currentScore=0;
};

//判输赢函数
var judgeFailed=function(){
	if(!move(up)){
		if(!move(down)){
			if(!move(left)){
				if(!move(right)){
					return true;
				}
			}
		}
	}
	unBackup();
	return false;
};
//根据按键码获取方向
var getDirection=function(keyCode){
	switch(keyCode){
		case 87:;
		case 38:;
		case 101:
			return up;
		case 83:;
		case 40:;
		case 98:
			return down;
		case 65:;
		case 37:;
		case 97:
			return left;
		case 68:;
		case 39:;
		case 99:
			return right;
		default:
			return -1;
	}
};

$(window).keydown(function(event){
	//上87/38/101
	//下83/40/98
	//左65/37/97
	//右68/39/99
	if(event.keyCode==27){
		resetGame();
		return;
	}
	if(failed)return;
	var direction=getDirection(event.keyCode);
	if(move(direction)){
		score+=currentScore;
		newDot();
		display();
		backup();
	}
	failed=judgeFailed();
	if(failed)alert("你输了!");
});