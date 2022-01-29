var possibleColors = ["red", "blue"];
var bigProjectTitles = ["Big project 1", "Big project 2", "Big project 3"];
var bigProjectTitlesAmount = bigProjectTitles.length;

var BigProject = {
    title: "Big project title",
    reward: 0,
    goals: [],

    getProgress: function() {
        var currAmount = 0, totalAmount = 0;
        for(var i=0; i < this.goals.length; ++i)
        {
            currAmount += this.goals[i].currAmount;
            totalAmount += this.goals[i].totalAmount;
        }
        return Math.round(currAmount/totalAmount*100);
    },

    updateTitle: function() {
        $("#bigProjectTitle").text(this.title);
    },

    updateReward: function() {
        $("#bigProjectReward").text("$"+this.reward);
    },

    updateProgress: function() {
        var percentage = this.getProgress();
        $("#bigProjectMainProgressBarBackground").css("width", percentage+"%");
        $("#bigProjectMainProgressBarLabel").text(percentage+"%");

        if(percentage == 100)
        {
            // Finished project
            cash += this.reward;
            Achievements.checkAchievementsType("totalCash");
            updateCash();

            ++Player.bigProjectsCompleted;
            Achievements.checkAchievementsType("bigProjectsCompleted");

            ++Player.projectsCompleted;
            Achievements.checkAchievementsType("projectsCompleted");

            for(var i=0; i < this.goals.length; ++i)
                this.goals[i].destroyGoal();
            this.goals = [];

            if(soundsEnabled)
            {
                //console.log("play big");
                //document.getElementById("cash_in").play();
                playCashSound();
            }

            this.shuffle();
        }
    },

    updateAll: function() {
        this.updateTitle();
        this.updateReward();
        this.updateProgress();
    },

    getRandomReward: function() {
        return Player.level*randomInteger(10, 20);
    },

    shuffle: function() {
        this.title = bigProjectTitles[randomInteger(0, bigProjectTitlesAmount-1)];
        this.reward = this.getRandomReward();
        var goals = randomInteger(2, 3);
        for(var i=0; i < goals; ++i)
        {
            var newGoal = new BigProjectGoal();
            newGoal.id = "goal-"+i;
            newGoal.totalAmount = newGoal.getRandomTarget();
            newGoal.color = possibleColors[randomInteger(0, possibleColors.length-1)];
            newGoal.createGoal();
        }

        this.updateAll();
    },

    idleGain: function() {
        //console.log("idle gain");
        var totalIdleGain = Player.idlePower;
        if(totalIdleGain == 0)
            return;

        var incompleteGoals = [];
        for(var i=0; i < BigProject.goals.length; ++i)
        {
            if(!BigProject.goals[i].completed)
                incompleteGoals[incompleteGoals.length] = BigProject.goals[i];
        }
        if(incompleteGoals.length == 0)
            return;

        //console.log(totalIdleGain + " to be split between " + incompleteGoals.length + " goals");

        var currGoal = 0, percentage = 0, toGive = 0;
        while(totalIdleGain > 0)
        {
            percentage = Math.round(randomInteger(0, 100))/100;
            toGive = Math.round(totalIdleGain*percentage);
            totalIdleGain -= toGive;
            incompleteGoals[currGoal].addProgress(toGive);
            currGoal = (currGoal+1)%incompleteGoals.length;
        }

        BigProject.updateProgress();
    }
};

function BigProjectGoal() {
    this.id = "goal-1";
    this.currAmount = 0;
    this.totalAmount = 0;
    this.color = "red";
    this.completed = false;

    this.update = function() {
        var goal = $("#"+this.id);

        if(this.completed)
            return;

        var percentage = Math.round(this.currAmount/this.totalAmount*100);
        if(percentage == 100)
        {
            this.completed = true;
            $(goal).find(".goalButton").hide();
        }


        $(goal).find(".progressBarBackground").css("width", percentage+"%");
        $(goal).find(".progressBarLabel").text(percentage+"%");

        $(goal).find(".currentAmount").text(this.currAmount);
        $(goal).find(".totalAmount").text(this.totalAmount);
    };

    this.addProgress = function(amount) {
        if(this.completed)
            return;

        this.currAmount += amount;
        if(this.currAmount > this.totalAmount)
            this.currAmount = this.totalAmount;

        this.update();
    };

    this.destroyGoal = function() {
        //console.log("destroy #"+this.id);
        $("#"+this.id).remove();
    };

    this.createGoal = function() {
        var goal = document.createElement("div");
        $(goal).addClass("projectGoal");
        $(goal).attr("id", this.id);

        var goalBarAndAmount = document.createElement("div");
        $(goalBarAndAmount).addClass("goalBarAndAmount");

            var goalBar = document.createElement("div");
            $(goalBar).addClass("projectGoalBar");
            $(goalBar).addClass(this.color);

            var progressBarBackground = document.createElement("div");
            $(progressBarBackground).addClass("progressBarBackground");
            var progressBarLabel = document.createElement("div");
            $(progressBarLabel).addClass("progressBarLabel");
            $(progressBarLabel).text("0%");

            var goalAmount = document.createElement("div");
            $(goalAmount).addClass("projectGoalAmount");
            $(goalAmount).html("<span class=\"currentAmount\">0</span>\
            /\
            <span class=\"totalAmount\">0</span>");

            $(goalBar).append(progressBarBackground);
            $(goalBar).append(progressBarLabel);
        $(goalBarAndAmount).append(goalBar);
        $(goalBarAndAmount).append(goalAmount);
        $(goal).append(goalBarAndAmount);


        var goalButton = document.createElement("div");
        $(goalButton).addClass("goalButton");

            var goalClickImg = document.createElement("img");
            goalClickImg.src = "images/keyboard.png";
            goalClickImg.alt = "Work";
            $(goalClickImg).attr("id", this.id + "button");
            $(goalClickImg).click(goalButtonClick);

            $(goalButton).append(goalClickImg);
        $(goal).append(goalButton);

        var clear = document.createElement("div");
        $(clear).addClass("clear");
        $(clear).addClass("left");

        $(goal).append(clear);

        $("#bigProjectGoals").append(goal);

        BigProject.goals[BigProject.goals.length] = this;

        this.update();
    };

    this.getRandomTarget = function() {
        return Player.level*randomInteger(5, 10);
    }
}


function goalButtonClick()
{
    var goalID = $(this).attr("id").substr(0, $(this).attr("id").indexOf("button"));

    for(var i=0; i < BigProject.goals.length; ++i)
    {
        if(BigProject.goals[i].id == goalID)
        {
            BigProject.goals[i].addProgress(Player.clickPower);

            BigProject.updateProgress();
            break;
        }
    }
}