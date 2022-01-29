var smallProjectTitles = ["Project 1", "Project 2", "Project 3"];
var smallProjectTitlesAmount = smallProjectTitles.length;

var SmallProject = {
    title: "Title",
    currAmount: 0,
    totalAmount: 0,
    reward: 0,

    updateTitle: function() {
        $("#smallProjectTitle").text(this.title);
    },

    updateAmounts: function() {
        var amounts = $("#smallProjectProgressAmount");
        amounts.children("span.currentAmount").html(this.currAmount);
        amounts.children("span.totalAmount").html(this.totalAmount);

        this.updateProgressBar();
    },

    updateProgressBar: function() {
        var percentage = 100;
        if(this.totalAmount != 0)
            percentage = Math.floor(this.currAmount/this.totalAmount*100);

        $("#smallProjectProgressBarBackground").css("width", percentage+"%");
        $("#smallProjectProgressBarLabel").text(percentage+"%");
    },

    updateReward: function() {
        $("#smallProjectRewardAmount").text(this.reward);
    },

    update: function() {
        this.updateTitle();
        this.updateAmounts();
        this.updateReward();
    },

    getRandomRequirements: function() {
        return randomInteger(Player.level*5, Player.level*10);
    },

    getRandomReward: function() {
        return randomInteger(Player.level*5, Player.level*10);
    },

    shuffle: function() {
        this.title = smallProjectTitles[Math.floor(Math.random()*smallProjectTitlesAmount)];
        this.currAmount = 0;
        this.totalAmount = this.getRandomRequirements();
        this.reward = this.getRandomReward();
        this.update();
    },

    addPoints: function(points) {
        this.currAmount += points;
        if(this.currAmount > this.totalAmount)
            this.currAmount = this.totalAmount;

        // Check if finished project
        if(this.currAmount == this.totalAmount)
        {
            // Project is finished
            ++Player.projectsCompleted;
            Achievements.checkAchievementsType("projectsCompleted");

            cash += this.reward;
            Achievements.checkAchievementsType("totalCash");

            updateCash();
            this.shuffle();

            if(soundsEnabled)
            {
                //document.getElementById("cash_in").play();
                //console.log("play");
                //$("#cash_in").trigger("play");
                playCashSound();
            }
        }
        this.updateAmounts();
    },

    buttonClick: function() {
        SmallProject.addPoints(Player.clickPower);
    }
};