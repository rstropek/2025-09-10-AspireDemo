using System.Net.Sockets;

var builder = DistributedApplication.CreateBuilder(args);

var mosquitto = builder.AddContainer("mosquitto", image: "eclipse-mosquitto:latest")
    .WithBindMount(Path.Join("..", "Mosquitto", "mosquitto.conf"), "/mosquitto/config/mosquitto.conf")
    .WithEndpoint("mqtt", e =>
    {
        e.Port = 1883;
        e.TargetPort = 1883;
        e.Protocol = ProtocolType.Tcp;
        e.UriScheme = "tcp";
    });

var mongo = builder.AddMongoDB("mongodb")
    .WithDataVolume("mongodata2", isReadOnly: false)
    .WithMongoExpress();
var mongoDb = mongo.AddDatabase("mongodbdatabase");

var grpcServer = builder.AddProject<Projects.GrpcServer>("grpcserver");

var webapi = builder.AddProject<Projects.WebApi>("webapi")
    .WithReference(grpcServer)
    .WithReference(mosquitto.GetEndpoint("mqtt"))
    .WithEnvironment(ctx =>
    {
        var ep = mosquitto.GetEndpoint("mqtt");
        ctx.EnvironmentVariables["MQTT__HOST"] = ep.Host;
        ctx.EnvironmentVariables["MQTT__PORT"] = ep.Port.ToString();
    })
    .WithReference(mongoDb).WaitFor(mongoDb)
    .WithReplicas(2);

var frontend = builder.AddNpmApp("frontend", Path.Combine("..", "Frontend"))
    .WithReference(webapi)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints();

builder.Build().Run();
