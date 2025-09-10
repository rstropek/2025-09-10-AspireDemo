var builder = DistributedApplication.CreateBuilder(args);

var grpcServer = builder.AddProject<Projects.GrpcServer>("grpcserver");

var webapi = builder.AddProject<Projects.WebApi>("webapi")
    .WithReference(grpcServer)
    .WithReplicas(2);

var frontend = builder.AddNpmApp("frontend", Path.Combine("..", "Frontend"))
    .WithReference(webapi)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints();

builder.Build().Run();
