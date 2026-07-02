let chart = null;

function updateChart() {

    const todoCount = tasks.filter(task => task.status === "todo").length;

    const progressCount = tasks.filter(task => task.status === "progress").length;

    const doneCount = tasks.filter(task => task.status === "done").length;

    const ctx = document.getElementById("taskChart");

    if (!ctx) return;

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [
                "To Do",
                "In Progress",
                "Done"
            ],

            datasets: [{

                data: [
                    todoCount,
                    progressCount,
                    doneCount
                ],

                backgroundColor: [
                    "#3b82f6",
                    "#f59e0b",
                    "#22c55e"
                ],

                borderWidth: 0,

                hoverOffset: 20

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "60%",

            animation: {
                animateRotate: true,
                animateScale: true
            },

            plugins: {

                legend: {

                    position: "bottom",
                    align: "center",

                    labels: {

                        color: "#cbd5e1",

                        padding: 20,

                        font: {
                            family: "Poppins",
                            size: 14,
                            weight: "600"
                        }

                    }

                },

                tooltip: {

                    backgroundColor: "#1e293b",

                    titleColor: "#ffffff",

                    bodyColor: "#ffffff",

                    cornerRadius: 10,

                    padding: 12

                }

            }

        }

    });

}