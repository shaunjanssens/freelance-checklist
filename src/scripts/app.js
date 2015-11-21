/**
 * @author: Shaun Janssens
 */

$(document).ready(function() {

    var global = {
        hash : "default",

        init : function() {
            this.hashChange();
        },

        hashChange : function() {
            var hash = this.getHash();

            interview.init(hash);
            checklist.init(hash);
        },

        getHash : function() {
            var hash = this.hash;

            if(window.location.hash) {
                hash = window.location.hash.substring(2);
            }

            return hash;
        }
    }

    /**
     * Interview class
     * @type {{questions: {}, questions_json: string, init: Function, loadQuestions: Function, showQuestions: Function, saveStorage: Function, loadStorage: Function, reset: Function, resize: Function}}
     */
    var interview = {
        questions : {},
        questions_json : "json/questions.json",
        hash : "",
        interview_container : ".interview",
        textarea_container : ".interview article textarea",

        init : function(hash) {
            this.soft_reset();
            this.loadQuestions();
            this.hash = hash;
            this.questions = {};
        },

        /**
         * Load data
         */
        loadQuestions : function() {
            jQuery.ajax({
                url: interview.questions_json,
                type:"GET",
                dataType: "json",
                success: function(data) {
                    interview.questions = data;
                    interview.showQuestions();
                },
                error : function(xhr, textStatus, errorThrown ) {
                    alert("Error: fout bij ophalen van data. Code: " + xhr.status);
                }
            });
        },

        /**
         * Show all questions
         */
        showQuestions : function() {
            questions = this.questions;

            var handlebars = Handlebars.templates['interview'];
            $(this.interview_container).empty().append(handlebars(questions));

            interview.loadStorage();
        },

        /**
         * Save data to localstorage
         */
        saveStorage : function() {
            var questions = $(this.textarea_container);

            var output = {};

            for(var i = 0; i < questions.length; i++) {
                var name = questions[i].name;
                var value = questions[i].value;

                output[name] = value;
            }

            localStorage.setItem(this.hash + "_questions", JSON.stringify(output));
        },

        /**
         * Load data from localstorage
         */
        loadStorage : function() {
            var data = localStorage.getItem(this.hash + "_questions");
            data = JSON.parse(data);

            for (var question in data) {
                var element = $("#" + question);

                element.val(data[question]);

                if(data[question]) {
                    element.prev("label").addClass("active");
                }
            }

            interview.resize();
        },

        /**
         * Reset all data
         */
        soft_reset : function() {
            var questions = $(this.textarea_container);

            for(var i = 0; i < questions.length; i++) {
                $(questions[i]).val("").prev("label").removeClass("active");
            }

        },

        /**
         * Reset all data and save
         */
        hard_reset : function() {
            interview.soft_reset();
            interview.saveStorage();
        },

        /**
         * Resize all textarea
         */
        resize : function(soft) {
            var questions = $(this.textarea_container);

            for(var i = 0; i < questions.length; i++) {
                var element = questions[i];
                var offset = element.offsetHeight - element.clientHeight;
                $(element).css('height', 'auto').css('height', element.scrollHeight + offset);
            }
        }

    };

    /**
     * Checklist class
     * @type {{tasks: {}, tasks_json: string, init: Function, loadTasks: Function, showTasks: Function, saveStorage: Function, loadStorage: Function, reset: Function}}
     */
    var checklist = {
        tasks : {},
        tasks_json : "json/tasks.json",
        hash : "",
        checklist_container : ".checklist",
        checkbox_container : ".checklist label input",


        init : function(hash) {
            this.soft_reset();
            this.loadTasks();
            this.hash = hash;
        },

        /**
         * Load data
         */
        loadTasks : function() {
            jQuery.ajax({
                url: checklist.tasks_json,
                type:"GET",
                dataType: "json",
                success: function(data) {
                    checklist.tasks = data;
                    checklist.showTasks();
                },
                error : function(xhr, textStatus, errorThrown ) {
                    alert("Error: fout bij ophalen van data. Code: " + xhr.status);
                }
            });
        },

        /**
         * Show tasks
         */
        showTasks : function() {
            tasks = this.tasks;

            var handlebars = Handlebars.templates['checklist'];
            $(this.checklist_container).empty().append(handlebars(tasks));

            checklist.loadStorage();
        },

        /**
         * Save data to localstorage
         */
        saveStorage : function() {
            var tasks = $(this.checkbox_container);

            var output = {};

            for(var i = 0; i < tasks.length; i++) {
                var name = tasks[i].name;
                if($(tasks[i]).is(":checked")) {
                    output[name] = true;
                } else {
                    output[name] = false;
                }
            }

            localStorage.setItem(this.hash + "_tasks", JSON.stringify(output));
        },

        /**
         * Load data from localstorage
         */
        loadStorage : function() {
            var data = localStorage.getItem(this.hash + "_tasks");
            data = JSON.parse(data);

            for (var task in data) {
                var element = $("#" + task);

                element.val(data[task]);

                if(data[task]) {
                    $(element).prop('checked', true);
                    $(element).parent("label").addClass("done");
                } else {
                    $(element).prop('checked', false);
                    $(element).parent("label").removeClass("done");
                }
            }
        },

        /**
         * Reset all data
         */
        soft_reset : function() {
            var tasks = $(this.checkbox_container);

            for(var i = 0; i < tasks.length; i++) {
                $(tasks[i]).prop('checked', false);
                $(tasks[i]).parent("label").removeClass("done");
            }
        },

        hard_reset : function() {
            checklist.soft_reset();
            checklist.saveStorage();
        }


    };

    // Automatic resize textarea
    $(document).on("keyup input", "textarea", function() {
        var offset = this.offsetHeight - this.clientHeight;
        $(this).css('height', 'auto').css('height', this.scrollHeight + offset);
    });

    // Add class on active
    $(document).on("focus", "textarea", function(event){
        $(this).prev("label").addClass("active");
    });

    // Remove class on blur
    $(document).on("blur", "textarea", function(event){
        if($(this).val()) {
            interview.saveStorage();
        } else {
            $(this).prev("label").removeClass("active");
        }
    });

    // Add class if checked
    $(document).on("change", "input[type=checkbox]", function(event) {
        if(this.checked) {
            $(this).parent("label").addClass("done");
        } else {
            $(this).parent("label").removeClass("done");
        }

        checklist.saveStorage();
    });

    // Export all data
    $(document).on("click", "#export", function(event) {
        alert("Deze werkt nog niet");
    });

    // Reset all data
    $(document).on("click", "#reset", function(event) {
        interview.hard_reset();
        checklist.hard_reset();
    });

    // Check hash change
    $(window).on('hashchange', function() {
        global.hashChange();
    });

    // Init
    global.init();
});