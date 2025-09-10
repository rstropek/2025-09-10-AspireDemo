var builder = DistributedApplication.CreateBuilder(args);

var webapi = builder.AddProject<Projects.WebApi>("webapi")
    .WithReplicas(2);

builder.Build().Run();
