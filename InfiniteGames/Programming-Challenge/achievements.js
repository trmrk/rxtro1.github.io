var achievementsList = [
    {
        id: "achievementFirstStep",
        name: "First step",
        image: "first.png",
        type: "projectsCompleted",
        goal: 1,
        completed: false
    },
    {
        id: "achievementFive",
        name: "5 projects",
        image: "five.png",
        type: "projectsCompleted",
        goal: 5,
        completed: false
    },
    {
        id: "achievement5Ppc",
        name: "5 pts/click",
        image: "pointer.png",
        type: "pointsPerClick",
        goal: 5,
        completed: false
    },
    {
        id: "achievement5Pps",
        name: "5 pts/sec",
        image: "five.png",
        type: "pointsPerSec",
        goal: 5,
        completed: false
    },
    {
        id: "achievement5BigProject",
        name: "5 big projects",
        image: "five.png",
        type: "bigProjectsCompleted",
        goal: 5,
        completed: false
    },
    {
        id: "achievement30Projects",
        name: "Experienced",
        image: "programmer.png",
        type: "projectsCompleted",
        goal: 30,
        completed: false
    },
    {
        id: "achievement50BigProjects",
        name: "Market leader",
        image: "office-building.png",
        type: "bigProjectsCompleted",
        goal: 50,
        completed: false
    },
    {
        id: "achievementMillionaire",
        name: "Millionaire",
        image: "banknote.png",
        type: "totalCash",
        goal: 1000000,
        completed: false
    },
    {
        id: "achievementBigClick",
        name: "Heavy clicks",
        image: "pointer.png",
        type: "pointsPerClick",
        goal: 200,
        completed: false
    },
    {
        id: "achievementBoss",
        name: "Company boss",
        image: "office-building.png",
        type: "pointsPerSec",
        goal: 500,
        completed: false
    }
];

var achievementsAmount = achievementsList.length;

var achievementsTypes = {
    projectsCompleted: [],
    bigProjectsCompleted: [],
    totalCash: [],
    pointsPerClick: [],
    pointsPerSec: []
};

var Achievements = {
    build: function() {
        this.parse();

        var achievementTiles = document.getElementById("achievementTiles");

        for(var i=0; i < achievementsAmount; ++i)
        {
            var tile = document.createElement("div");
            $(tile).addClass("achievementTile");
            $(tile).attr("id", achievementsList[i].id);

            var description = document.createElement("div");
            $(description).addClass("achievementDescription");
            //$(description).text("Placeholder");

            var cover = document.createElement("div");
            $(cover).addClass("achievementCover");
            if(!achievementsList[i].completed)
                $(cover).addClass("active");

            var achievementImg = document.createElement("img");
            achievementImg.src = "images/achievements/" + achievementsList[i].image;
            achievementImg.alt = achievementsList[i].name;


            $(tile).mouseover(Achievements.showDescription);
            $(tile).mouseout(Achievements.hideDescription);
            $(tile).mousemove(Achievements.adjustDescription);


            $(tile).append(description);
            $(tile).append(cover);
            $(tile).append(achievementImg);
            $(achievementTiles).append(tile);
        }
        this.updateAll();
    },

    parse: function() {
        for(var i=0; i < achievementsAmount; ++i)
        {
            switch(achievementsList[i].type)
            {
                case "projectsCompleted":
                    achievementsTypes.projectsCompleted[achievementsTypes.projectsCompleted.length] = achievementsList[i].id;
                    break;

                case "bigProjectsCompleted":
                    achievementsTypes.bigProjectsCompleted[achievementsTypes.bigProjectsCompleted.length] = achievementsList[i].id;
                    break;

                case "totalCash":
                    achievementsTypes.totalCash[achievementsTypes.totalCash.length] = achievementsList[i].id;
                    break;

                case "pointsPerClick":
                    achievementsTypes.pointsPerClick[achievementsTypes.pointsPerClick.length] = achievementsList[i].id;
                    break;

                case "pointsPerSec":
                    achievementsTypes.pointsPerSec[achievementsTypes.pointsPerSec.length] = achievementsList[i].id;
                    break;

                default:
                    // Unknown type
                    console.log("achievement number " + (i+1) + "(" + achievementsList[i].name + ") does not have an appropriate type, fix it");
                    break;
            }
        }
    },

    updateAchievementById: function(achievementId) {
        var i = 0;
        for(i=0; i < achievementsAmount; ++i)
        {
            if(achievementsList[i].id == achievementId)
                break;
        }

        var achievementTile = document.getElementById(achievementId);
        var valueToInsert = achievementsList[i].goal;

        // Description
        switch(achievementsList[i].type)
        {
            case "projectsCompleted":
                if(!achievementsList[i].completed)
                    valueToInsert = Player.projectsCompleted;

                $(achievementTile).children("div.achievementDescription").html("<span class=\"achievementTitle\">" + achievementsList[i].name + "</span>" + valueToInsert + " / " + achievementsList[i].goal + " projects completed");
                break;

            case "bigProjectsCompleted":
                if(!achievementsList[i].completed)
                    valueToInsert = Player.bigProjectsCompleted;

                $(achievementTile).children("div.achievementDescription").html("<span class=\"achievementTitle\">" + achievementsList[i].name + "</span>" + valueToInsert + " / " + achievementsList[i].goal + " big projects completed");
                break;

            case "totalCash":
                if(!achievementsList[i].completed)
                    valueToInsert = cash;

                $(achievementTile).children("div.achievementDescription").html("<span class=\"achievementTitle\">" + achievementsList[i].name + "</span>" + valueToInsert + " / " + achievementsList[i].goal + " cash");
                break;

            case "pointsPerClick":
                if(!achievementsList[i].completed)
                    valueToInsert = Player.clickPower;

                $(achievementTile).children("div.achievementDescription").html("<span class=\"achievementTitle\">" + achievementsList[i].name + "</span>" + valueToInsert + " / " + achievementsList[i].goal + " pts/click");
                break;

            case "pointsPerSec":
                if(!achievementsList[i].completed)
                    valueToInsert = Player.idlePower;

                $(achievementTile).children("div.achievementDescription").html("<span class=\"achievementTitle\">" + achievementsList[i].name + "</span>" + valueToInsert + " / " + achievementsList[i].goal + " pts/sec");
                break;


            default:
                // Unknown type
                break;
        }

        // Cover
        if(achievementsList[i].completed)
            $(achievementTile).children("div.achievementCover").removeClass("active");
        else
            $(achievementTile).children("div.achievementCover").addClass("active");
    },

    updateAll: function() {
        for(var i=0; i < achievementsAmount; ++i)
            this.updateAchievementById(achievementsList[i].id);
    },

    checkAchievementsType: function(achievementType) {
        switch(achievementType) {
            case "projectsCompleted":
                for(var i=0; i < achievementsTypes.projectsCompleted.length; ++i)
                {
                    var achievementNumber = 0;
                    for( ; achievementNumber < achievementsAmount; ++achievementNumber)
                    {
                        if(achievementsList[achievementNumber].id == achievementsTypes.projectsCompleted[i])
                            break;
                    }

                    if(!achievementsList[achievementNumber].completed)
                    {
                        if(Player.projectsCompleted >= achievementsList[achievementNumber].goal)
                            achievementsList[achievementNumber].completed = true;
                    }
                    this.updateAchievementById(achievementsList[achievementNumber].id);
                }
                break;

            case "bigProjectsCompleted":
                for(var i=0; i < achievementsTypes.bigProjectsCompleted.length; ++i)
                {
                    var achievementNumber = 0;
                    for( ; achievementNumber < achievementsAmount; ++achievementNumber)
                    {
                        if(achievementsList[achievementNumber].id == achievementsTypes.bigProjectsCompleted[i])
                            break;
                    }

                    if(!achievementsList[achievementNumber].completed)
                    {
                        if(Player.bigProjectsCompleted >= achievementsList[achievementNumber].goal)
                            achievementsList[achievementNumber].completed = true;
                    }
                    this.updateAchievementById(achievementsList[achievementNumber].id);
                }
                break;

            case "totalCash":
                for(var i=0; i < achievementsTypes.totalCash.length; ++i)
                {
                    var achievementNumber = 0;
                    for( ; achievementNumber < achievementsAmount; ++achievementNumber)
                    {
                        if(achievementsList[achievementNumber].id == achievementsTypes.totalCash[i])
                            break;
                    }

                    if(!achievementsList[achievementNumber].completed)
                    {
                        if(cash >= achievementsList[achievementNumber].goal)
                            achievementsList[achievementNumber].completed = true;
                    }
                    this.updateAchievementById(achievementsList[achievementNumber].id);
                }
                break;

            case "pointsPerClick":
                for(var i=0; i < achievementsTypes.pointsPerClick.length; ++i)
                {
                    var achievementNumber = 0;
                    for( ; achievementNumber < achievementsAmount; ++achievementNumber)
                    {
                        if(achievementsList[achievementNumber].id == achievementsTypes.pointsPerClick[i])
                            break;
                    }

                    if(!achievementsList[achievementNumber].completed)
                    {
                        if(Player.clickPower >= achievementsList[achievementNumber].goal)
                            achievementsList[achievementNumber].completed = true;
                    }
                    this.updateAchievementById(achievementsList[achievementNumber].id);
                }
                break;

            case "pointsPerSec":
                for(var i=0; i < achievementsTypes.pointsPerSec.length; ++i)
                {
                    var achievementNumber = 0;
                    for( ; achievementNumber < achievementsAmount; ++achievementNumber)
                    {
                        if(achievementsList[achievementNumber].id == achievementsTypes.pointsPerSec[i])
                            break;
                    }

                    if(!achievementsList[achievementNumber].completed)
                    {
                        if(Player.idlePower >= achievementsList[achievementNumber].goal)
                            achievementsList[achievementNumber].completed = true;
                    }
                    this.updateAchievementById(achievementsList[achievementNumber].id);
                }
                break;

            default:
                console.log("uknown achievement type to be checked: "+ achievementType);
                break;
        }
    },

    showDescription: function() {
        $(this).children("div.achievementDescription").show();
    },

    hideDescription: function() {
        $(this).children("div.achievementDescription").hide();
    },

    adjustDescription: function(event) {
        $(this).children("div.achievementDescription").css("left", event.clientX+0.01*window.innerWidth);
        $(this).children("div.achievementDescription").css("top", event.clientY);
    }
};