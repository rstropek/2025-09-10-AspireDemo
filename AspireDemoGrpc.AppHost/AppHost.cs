var builder = DistributedApplication.CreateBuilder(args);

var grpcServer = builder.AddProject<Projects.GrpcServer>("grpcserver");

var webapi = builder.AddProject<Projects.WebApi>("webapi")
    .WithReference(grpcServer)
    .WithReplicas(2);

builder.Build().Run();
