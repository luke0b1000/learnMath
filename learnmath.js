jQuery(function ($) {

    const LS_NAMESPACE = 'learnMath';

    /**
     * Creates and manage the equation
     *      questionObject = 
     *      {
     *          highNum         = highest Number
     *          lowNum          = lowest Number
     *          mathOperation   = addition (default) / subtraction / multiplication / division
     *          userAnswer      = What the user thinks the answer is
     *      }
     *          
     */
    var equationObject = {
        /**
         * Initiate the process of creating the equation, setting default to addition
         * Create a new equation, if there isn't a question in localStorage
         * Set the object
         */ 
        init: function () {
            this.mathOperation = 'addition';
            questionObject = LS_util.getLearnMathQuestion() || this.createQuestion(this.mathOperation);
            this.setQuestionObject(questionObject); // floods the equationObject
        },
        /**
         * Set the question object globally inside equationObject
         */
        setQuestionObject: function (questionObject) {
            this.questionObject = questionObject;
        },
        /**
         * Get the question object
         * @return {object} questionObject
         */
        getQuestionObject: function () {
            return this.questionObject;
        },
        /**
         *  Create the Math Equation
         *  @param  {string}  mathOperation   type of equation generated
         *  @return {string}  questionObject
         */
        createQuestion: function (mathOperation) {
            var highNum, lowNum;
            var rnum1 = this.generateRandomNumber();
            var rnum2 = this.generateRandomNumber();
            if (rnum1 > rnum2) {
                highNum = rnum1;
                lowNum = rnum2;
            } else {
                highNum = rnum2;
                lowNum = rnum1;
            }
            if (mathOperation) {
                this.mathOperation = mathOperation;
            }
            
            questionObject = {
                lowNum: lowNum,
                highNum: highNum,
                mathOperation: this.mathOperation,
                userAnswer: undefined,
            };
            var correctAnswer = arithmatic[equationObject.mathOperation](highNum, lowNum)
            if (this.mathOperation === "division" && lowNum === 0 || correctAnswer % 1 !== 0) {
                this.createQuestion();
            }
            this.setQuestionObject(questionObject);
            LS_util.setLearnMathQuestion(questionObject);
            return questionObject;
        },
        /**
         * Generate random number
         * @return {Number} random number
         */
        generateRandomNumber: function () {
            return Math.floor(Math.random() * Math.pow(10, 1));
        },
        checkAnswer: function (answerInput) {
            questionObject = this.getQuestionObject();
            questionObject.userAnswer = answerInput;
            return questionObject;
        },
        getMathOperationSymbol: function (mathOperation) {
            var arithmatic = {
                addition: '+',
                subtraction: '-',
                multiplication: '*',
                division: '/',
            };
            return arithmatic[mathOperation];
        },
        setMathOperation: function (mathOperation) {
            this.mathOperation = mathOperation;
        },
    };
    /**
     *  Where the actual math happens
     */
    var arithmatic = {
        /**
         *  Add the two input together
         *  @param  {Number}  a     a
         *  @param  {Number}  b     b
         *  @return {Number}  Answer to adding a + b
         */
        addition: function (a, b) {
            return a + b;
        },
        subtraction: function (a, b) {
            return a - b;
        },
        multiplication: function (a, b) {
            return a * b;
        },
        division: function (a, b) {
            return a / b;
        }
    };
    

    var LS_util = {
        setLearnMathObjectToLS: function (data) {
            localStorage.setItem(LS_NAMESPACE, JSON.stringify(data));
        },
        getLearnMathObjectFromLS: function () {
            return JSON.parse(localStorage.getItem(LS_NAMESPACE));
        },
        getLearnMathQuestion: function () {
            return this.getLearnMathObjectFromLS() ? this.getLearnMathObjectFromLS().question : null;
        },
        setLearnMathQuestion: function (questionObject) {
            var localObject = {};
            localObject.history = this.getLearnMathHistory();
            localObject.question = questionObject;
            this.setLearnMathObjectToLS(localObject);
        },
        getLearnMathHistory: function() {
            return this.getLearnMathObjectFromLS() ? this.getLearnMathObjectFromLS().history : null;
        },
        addLearnMathHistory: function(historyObject) {
            var localObject = {};
            localObject.question = this.getLearnMathQuestion();
            localObject.history = historyObject;
            this.setLearnMathObjectToLS(localObject);
        },
    };

    var view = {
        displayQuestion: function (questionObject) {
            symbol = equationObject.getMathOperationSymbol(questionObject.mathOperation);
            console.log(`Question: ${questionObject.highNum} ${symbol} ${questionObject.lowNum}   = `);
        },
        displayHistory: function (historyObject) {
            i = historyObject.length;
            while (i--) {
                var symbol = equationObject.getMathOperationSymbol(historyObject[i].mathOperation);
                var mathOperation = historyObject[i].mathOperation;
                correctAnswer = arithmatic[mathOperation](historyObject[i].highNum, historyObject[i].lowNum);
                var isCorrect = (correctAnswer === historyObject[i].userAnswer) ? 'Correct' : 'Incorrect';
                console.log(`${i}: ${isCorrect} - ${historyObject[i].highNum} ${symbol} ${historyObject[i].lowNum} = ${correctAnswer} ... You answered: ${historyObject[i].userAnswer}`);
            }
        },
        displayResponse: function (questionObject) {
            symbol = equationObject.getMathOperationSymbol(questionObject.mathOperation);
            correctAnswer = arithmatic[questionObject.mathOperation](questionObject.highNum, questionObject.lowNum);
            if (correctAnswer === questionObject.userAnswer) {
                console.log(`Correct: ${questionObject.highNum} ${symbol} ${questionObject.lowNum} = ${correctAnswer}`);
            } else {
                console.log(`Incorrect: ${questionObject.highNum} ${symbol} ${questionObject.lowNum} = ${correctAnswer}. You put ${questionObject.userAnswer}`);
            }
        },
    };
    var viewHTML = {
        displayQuestion: function(questionObject) {
            symbol = equationObject.getMathOperationSymbol(questionObject.mathOperation);
            displayQuestionHTML = `Question: ${questionObject.highNum} ${symbol} ${questionObject.lowNum}   = `;
            $("#displayQuestion").html(displayQuestionHTML);
        },
        displayResponse: function(questionObject) {
            symbol = equationObject.getMathOperationSymbol(questionObject.mathOperation);
            correctAnswer = arithmatic[questionObject.mathOperation](questionObject.highNum, questionObject.lowNum);
            if (correctAnswer === questionObject.userAnswer) {
                var displayResponseHTML = `Correct: ${questionObject.highNum} ${symbol} ${questionObject.lowNum} = ${correctAnswer}`;
            } else {
                var displayResponseHTML = `Incorrect: ${questionObject.highNum} ${symbol} ${questionObject.lowNum} = ${correctAnswer}. You put ${questionObject.userAnswer}`;
            }
            $("#response").html(displayResponseHTML);
        },
        displayHistory: function(historyObject) {
            $("#history").html('');
            i = historyObject.length;
            while(i--){
                var symbol = equationObject.getMathOperationSymbol(historyObject[i].mathOperation);
                var mathOperation = historyObject[i].mathOperation;
                correctAnswer = arithmatic[mathOperation](historyObject[i].highNum, historyObject[i].lowNum);
                var isCorrect = (correctAnswer === historyObject[i].userAnswer) ? 'Correct' : 'Incorrect';
                var oneQuestion = `${i}: ${isCorrect} - ${historyObject[i].highNum} ${symbol} ${historyObject[i].lowNum}   = ${correctAnswer} ... You answered: ${historyObject[i].userAnswer}`;
                var oneItem = $('<li></li>').text(oneQuestion);
                $("#history").append(oneItem);
            }
        },
    };

    var h = handler = {
        question: function () {
            var questionObject = equationObject.getQuestionObject();
            view.displayQuestion(questionObject);
            viewHTML.displayQuestion(questionObject);
            this.history();
        },
        answer: function (answerInput) {
            var questionObject = equationObject.checkAnswer(answerInput);
            view.displayResponse(questionObject);
            viewHTML.displayResponse(questionObject);
            learnMathHistory.addQuestionToHistory(questionObject);
            this.nextQuestion();
        },
        nextQuestion: function () {
            var questionObject = equationObject.createQuestion();
            view.displayQuestion(questionObject);
            viewHTML.displayQuestion(questionObject);
            this.history();
        },
        changeMathOperation: function (mathOperation) {
            equationObject.setMathOperation(mathOperation);
            this.nextQuestion();
        },
        clearLearnMath: function () {
            localStorage.clear();
            console.log('History cleared...');
        },
        history: function() {
            var historyObject = learnMathHistory.getHistoryObject();
            view.displayHistory(historyObject);
            viewHTML.displayHistory(historyObject);
        },
    }

    var learnMathHistory = {
        init: function() {
            this.getHistoryObject();
        },
        addQuestionToHistory: function(questionObject) {
            historyObject = this.getHistoryObject();
            historyObject.push(questionObject);
            LS_util.addLearnMathHistory(historyObject);
        },
        getHistoryObject: function() {
            return LS_util.getLearnMathHistory() || [];
        },
    };

    var App = {
        init: function () {
            equationObject.init();
            handler.question();
            learnMathHistory.init();
            $("#answerBox").on("submit", this.submitAnswer.bind(this));
            $("#historyContainer").on("click", function(){
                $("#history").toggle();
            });
            $("#mathOperation").on("click", ".moSpacing", function(event){
                handler.changeMathOperation(event.target.id);
                $("#inputAnswer").focus();
            });
            $("#clearHistory").on("click", handler.clearLearnMath );
        },
        submitAnswer: function(event) {
            event.preventDefault();
            var userAnswer = parseInt($("#inputAnswer").val());
            if (Number.isInteger(userAnswer)) {
                handler.answer(userAnswer);
                $("#inputAnswer").val('').focus();
            }
        },
    };

    App.init();

});