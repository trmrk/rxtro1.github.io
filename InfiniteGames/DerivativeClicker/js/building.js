function Building(factor, moneyCost, proofCost){
	this.owned = 0;
	this.manual = 0;
	this.factor = factor;
	this.moneyCost = moneyCost;
	this.proofCost = proofCost;
}

Building.prototype.add = function(num){
	this.owned += num;
}

function CurrBuyable(cost, text){
	this.owned = false;
	this.cost = cost; //cost is an array of length 6
}

CurrBuyable.prototype.buy = function(){
	this.owned = true;
}

function Achievement(name, text, condition){
	this.achieved = false;
	this.name = name;
	this.text = text;
	this.condition = new Function("return " + condition + ";");
	this.time = undefined;
}