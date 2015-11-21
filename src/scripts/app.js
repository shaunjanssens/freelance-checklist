/**
 * @author: Shaun Janssens
 */

$(document).ready(function() {
    var interview = {
        questions : {},
        questions_json : "json/questions.json",

        init : function() {
            this.loadQuestions();
        },

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

        showQuestions : function() {
            questions = this.questions;

            var handlebars = Handlebars.templates['interview'];
            $(".interview").append(handlebars(questions));

            interview.loadStorage();
        },

        saveStorage : function() {
            var questions = $(".interview article textarea");

            console.log(questions);

            for(var i = 0; i < questions.length; i++) {
                localStorage.setItem(questions[i].name, questions[i].value);
            }
        },

        loadStorage : function() {
            var questions = $(".interview article textarea");

            for(var i = 0; i < questions.length; i++) {
                var value = localStorage.getItem(questions[i].name);
                $(questions[i]).val(value);

                if ($(questions[i]).val()) {
                    $(questions[i]).prev("label").addClass("active");
                }
            }
        },

        reset : function() {
            var questions = $(".interview article textarea");

            for(var i = 0; i < questions.length; i++) {
                $(questions[i]).val("").prev("label").removeClass("active");
            }

            interview.saveStorage();
        }

    };
    interview.init();

    var checklist = {
        tasks : {},
        tasks_json : "json/tasks.json",

        init : function() {
            this.loadTasks();
        },

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

        showTasks : function() {
            tasks = this.tasks;

            var handlebars = Handlebars.templates['checklist'];
            $(".checklist").append(handlebars(tasks));

            checklist.loadStorage();
        },

        saveStorage : function() {
            var tasks = $(".checklist label input");

            for(var i = 0; i < tasks.length; i++) {
                if($(tasks[i]).is(":checked")) {
                    localStorage.setItem(tasks[i].name, true);
                } else {
                    localStorage.setItem(tasks[i].name, false);
                }
            }
        },

        loadStorage : function() {
            var tasks = $(".checklist label input");

            for(var i = 0; i < tasks.length; i++) {
                var task = tasks[i];

                var value = localStorage.getItem(task.name);

                if(value == "true") {
                    $(task).prop('checked', true);
                    $(task).parent("label").addClass("done");

                } else {
                    $(task).prop('checked', false);
                    $(task).parent("label").removeClass("done");
                }
            }
        },

        reset : function() {
            var tasks = $(".checklist label input");

            for(var i = 0; i < tasks.length; i++) {
                $(tasks[i]).prop('checked', false);
                $(tasks[i]).parent("label").removeClass("done");
            }

            checklist.saveStorage();
        }


    };
    checklist.init();

    // Textarea manipulation
    // add jquery mobile for better autogrow
    $('textarea').autogrow();

    $(document).on("focus", "textarea", function(event){
        $(this).prev("label").addClass("active");
    });

    $(document).on("blur", "textarea", function(event){
        if($(this).val()) {
            interview.saveStorage();
        } else {
            $(this).prev("label").removeClass("active");
        }
    });

    // Checkbox manipulation
    $(document).on("change", "input[type=checkbox]", function(event) {
        if(this.checked) {
            $(this).parent("label").addClass("done");
        } else {
            $(this).parent("label").removeClass("done");
        }

        checklist.saveStorage();
    });

    // Button listeners
    $(document).on("click", "#export", function(event) {
        alert("Deze werkt nog niet");
    });

    $(document).on("click", "#reset", function(event) {
        interview.reset();
        checklist.reset();
    });
});