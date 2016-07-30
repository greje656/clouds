
Clouds = {}

function Clouds:generate()
	cloud_resource1 = Renderer.resource("clouds_result_texture1")
	cloud_resource2 = Renderer.resource("clouds_result_texture2")
	cloud_resource3 = Renderer.resource("clouds_result_texture3")

	resource_maping1 = {}
	resource_maping2 = {}
	resource_maping3 = {}

	resource_maping1["input"] = cloud_resource1
	resource_maping2["input"] = cloud_resource2
	resource_maping3["input"] = cloud_resource3

	resource_maping1["output"] = cloud_resource1
	resource_maping2["output"] = cloud_resource2
	resource_maping3["output"] = cloud_resource3

	Renderer.run_resource_generator("cloud_generator_texture1", resource_maping1)
	Renderer.run_resource_generator("cloud_generator_texture2", resource_maping2)
	Renderer.run_resource_generator("cloud_generator_texture3", resource_maping3)
end

function Clouds.spawned(world, instances)
	Clouds:generate()
end

function Clouds.editor_spawned(world, instances)
	Clouds.spawned(world, instances)
end

return { component = Clouds }
