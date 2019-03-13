var targetUrl = "https://api.soe-nonprod.cloud.si.orange.es/customerviewmdg"+context.getVariable("request.path");
context.setVariable("target.copy.pathsuffix", "true");
context.setVariable("target.copy.queryparams", "true");
context.setVariable("target.ssl.enabled", "true");
context.setVariable("target.url", targetUrl);