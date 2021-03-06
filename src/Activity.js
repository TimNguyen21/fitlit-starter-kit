class Activity {
  constructor(usersRepository, activityDataSet) {
    this.userID = usersRepository.id;
    this.usersActivityData = activityDataSet;
  }

  findUserActivityDataByDate(date) {
    let currentUserActivityData = this.usersActivityData.find(data =>
      data.userID === this.userID && data.date === date);

    return currentUserActivityData;
  }

  findMilesWalkedByDay(userData, date) {
    let currentData = this.usersActivityData.find(data =>
      data.userID === this.userID && data.date === date);
    let milesWalked = ((currentData["numSteps"] *
      userData["strideLength"]) / 5280).toFixed(1);

    return `${milesWalked} Miles`;
  }

  findMinutesActiveByDay(date) {
    let currentData = this.usersActivityData.find(data =>
      data.userID === this.userID && data.date === date);

    return currentData["minutesActive"];
  }

  findAverageMinutesActiveByWeek(dateRange) {
    let userWeekMinutesActive = [];
    let userActivityData = this.usersActivityData.filter(activity =>
      activity.userID === this.userID);

    dateRange.forEach(date => {
      userActivityData.map(data => {
        if (date === data.date) {
          userWeekMinutesActive.push(data["minutesActive"]);
        }
      });
    })

    let totalMinuteforWeek = userWeekMinutesActive.reduce((acc, minutes) => {
      acc += minutes;
      return acc;
    }, 0);

    let averageMinutesForWeek = (totalMinuteforWeek / dateRange.length)
      .toFixed(1);

    return `${averageMinutesForWeek} minutes`;
  }

  determineStepGoalStatusForDay(userData, day) {
    let activityDaySummary = this.usersActivityData.find(data =>
      data.userID === this.userID && data.date === day);

    if (userData["dailyStepGoal"] > activityDaySummary["numSteps"]) {
      return 'Step goal not acheived';
    } else if (userData["dailyStepGoal"] <= activityDaySummary["numSteps"]) {
      return 'Step goal acheived!';
    }
  }

  findDaysExceedingStepGoal(userData) {
    let findAllUserActivityData = this.usersActivityData.filter(data =>
      data.userID === this.userID)
      .filter(data => userData["dailyStepGoal"] <= data["numSteps"])
      .map(data => {
        return {date: data["date"], numberOfSteps: data["numSteps"]};
      });

    return findAllUserActivityData;
  }

  findAllTimeStairClimb() {
    let findAllUserActivityData = this.usersActivityData.filter(data =>
      this.userID === data.userID)
      .sort((a, b) => b.flightsOfStairs - a.flightsOfStairs);

    let highestStairClimb = findAllUserActivityData.filter(data =>
      data["flightsOfStairs"] === findAllUserActivityData[0].flightsOfStairs)
      .map(data => {
        return {date: data["date"],
          numberOfSteps: data["flightsOfStairs"]};
      })

    return highestStairClimb;
  }

  calculateAllTimeTotalFlightsOfStairsTaken() {
    let findAllUserActivityData = this.usersActivityData.filter(data =>
      this.userID === data.userID)
      .reduce((acc, data) => {
        acc += data["flightsOfStairs"];
        return acc;
      }, 0)

    return `${findAllUserActivityData} Stairs`;
  }

  findAllUserAverageStairsClimbedForSpecificDate(date) {
    let findAllUserDataByDate = this.usersActivityData.filter(data =>
      data.date === date);

    let usersAverageStairsClimbByDate = findAllUserDataByDate
      .reduce((acc, data) => {
        acc += data["flightsOfStairs"];
        return acc;
      }, 0) / findAllUserDataByDate.length;

    let estimateAverage = usersAverageStairsClimbByDate.toFixed(0);

    return `${estimateAverage} Stairs`;
  }

  findAllUserAverageStepsTakeForSpecificDate(date) {
    let findAllUserDataByDate = this.usersActivityData.filter(data =>
      data.date === date);

    let usersAverageStepsByDate = findAllUserDataByDate.reduce((acc, data) => {
      acc += data["numSteps"];
      return acc;
    }, 0) / findAllUserDataByDate.length;

    let estimateAverage = usersAverageStepsByDate.toFixed(0);

    return `${estimateAverage} Steps`;
  }

  findAllUserAverageMinutesActiveForSpecificDate(date) {
    let findAllUserDataByDate = this.usersActivityData.filter(data =>
      data.date === date);

    let usersAverageMinutesActiveDate = findAllUserDataByDate
      .reduce((acc, data) => {
        acc += data["minutesActive"];
        return acc;
      }, 0) / findAllUserDataByDate.length;

    let estimateAverage = usersAverageMinutesActiveDate.toFixed(0);

    return `${estimateAverage} Minutes Active`;
  }

  findUserDailyActivityDataForWeek(dateRange) {
    let userWeekActivityData = [];

    let currentUserActivityData = this.usersActivityData.filter(data =>
      this.userID === data.userID);

    dateRange.forEach(date => {
      currentUserActivityData.map(data => {
        if (date === data.date) {
          userWeekActivityData.push(data);
        }
      })
    })

    return userWeekActivityData;
  }

  totalStepCount(id, dateRange) {
    let usersTotalSteps = [];

    dateRange.forEach(date => {
      let userDayActivity = this.usersActivityData.find(data =>
        data.userID === id && data.date === date);
      usersTotalSteps.push(userDayActivity["numSteps"]);
    })

    return  usersTotalSteps.reduce((acc, steps) => {
      acc += steps;
      return acc;
    }, 0);
  }

  getUserName(id, userDataSet) {
    return userDataSet.find(data => data.id === id).name;
  }

  findUserFriendsStepTotal(friends, userDataSet, dateRange) {
    let friendsTotalInfo = friends.reduce((acc, id) => {
      acc.push({name: this.getUserName(id, userDataSet),
        stepTotal: this.totalStepCount(id, dateRange)})
      return acc;
    }, [])

    return friendsTotalInfo.sort((a, b) => b.stepTotal - a.stepTotal);
  }

  findUsersWeeklyActivityData(dateRange) {
    let userActivitySummary = [];

    dateRange.forEach(day => {
      userActivitySummary.push(this.usersActivityData
        .find(data => data.userID === this.userID && data.date === day));
    })

    let usersActivitySummary = userActivitySummary.map(data => {
      return {date: data["date"], numSteps: data["numSteps"],
        minutesActive: data["minutesActive"]}
    })

    return usersActivitySummary;
  }


  findNumsStepTrends(weeklyActivityData) {
    let currentPass = []
    let overThreeTrends = []
    let currentStepCount = 0

    weeklyActivityData.forEach(data => {
      if (data.numSteps >= currentStepCount) {
        currentPass.push(data);
        currentStepCount = data.numSteps;
        if (currentPass.length >= 3) {
          overThreeTrends = currentPass;
        }
      } else if (data.numSteps < currentStepCount) {
        currentStepCount = 0;
        currentPass = [];
      }
    })

    if (overThreeTrends.length > 2) {
      return overThreeTrends
    } else {
      return `No increasing steps trend over 3 days`
    }
  }

  findMinutesActiveTrends(weeklyActivityData) {
    let currentPass = [];
    let overThreeTrends = [];
    let currentMinutesCount = 0;

    weeklyActivityData.forEach(data => {
      if (data.minutesActive >= currentMinutesCount) {
        currentPass.push(data)
        currentMinutesCount = data.minutesActive;
        if (currentPass.length >= 2) {
          overThreeTrends = currentPass;
        }
      } else if (data.minutesActive < currentMinutesCount) {
        currentMinutesCount = 0;
        currentPass = [];
      }
    })

    if (overThreeTrends.length > 2) {
      return overThreeTrends
    } else {
      return `No increased active minutes trend over 3 days`
    }
  }

}

if (typeof module !== 'undefined') {
  module.exports = Activity;
}
