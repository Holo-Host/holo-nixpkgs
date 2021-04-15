{ lib, ... }:

{
  imports = [
    ../.
    ../binary-cache.nix
    ../self-aware.nix
  ];

  time.timeZone = "UTC";

  # Anyone in this list is in a position to poison binary cache, commit active
  # MITM attack on hosting traffic, maliciously change client assets to capture
  # users' keys during generation, etc. Please don't add anyone to this list
  # unless absolutely required. Once U2F support in SSH stabilizes, we will
  # require that everyone on this list uses it along with a hardware token. We
  # also should set up sudo_pair <https://github.com/square/sudo_pair>.
  users.users.root.openssh.authorizedKeys.keys = lib.mkForce [
    # PJ Klimek
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJwtG0yk6e0szjxk3LgtWnunOvoXUJIncQjzX5zDiKxY"
    # evangineer
    "ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAo+FbntLXk628VDr8BJ4jygxnp2jl8FE9CTgwmGmT2eCAFbeFduJ/9Uzg7RFez6PdY5gXnOGpgtrPI7ZyIedb9mZLDRDyHQV9qY4HEOvYG6prVZi31Kvf4Ldh5puZXw8AqyE+igXo5AdPhbtJl9ZcbZR6p9/VP5a0AIzlRS5SzjPf+e0lDeYOc3IrzMVkDPz0XfVmeVnhGqv82cq1LYYbsmjGQnIBFQIX2znHFVU5+x7YVs0Nw+4ays0FxDyzvpK/gDW5OQsmgGOEWkOd4Ei1YRF2wNQki+SG3MC8RE19UB5kVuHutGJ7VA8NwBiEAITk6JCxXQo9bOcvh2Y4F0OnRQ=="
    # JettTech
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDi3LUUol3zA2cqvJr8fYu7OucUHLqEDpINl9OLOVKtTcGFMzwgFgRqhU8pb7VuqX8/92SZ+Ai4P1qM2uDjHDJ9rF4iNMktQulgINztON3UwtjH+4pfE+/+IzSsWq/Tv8ZErwdwXUsowUbpAoXS7An6zr/1koXTNpXLByIO35EaPuIOa29jAPTCXhK8RnXTyhTp+yMRTMaDyVXEDKAt25STJzjop0BVNNdw4fsd1DvpBhsBbd3e1Gx9nuih2TU0keYUjQ6FNm8toMnRI1Kst1yrmLOFh4HjHKNub4Zt/mxS4SWaInBo2Z9G9VNhpjKu57iN+k+LemQxG/hWsT8LAyppBFhCRAzUONAImyAOpdLnnavWQKJt3pziuVfTtzflvUgYDW07cpxOIxCH6I3PFLTpTCpqnAgX0KaCmT9G4Ado1Mk2CDaZPx6uuCJA/e3aTBlh592tByYzdxPzBzx7vb/jf9yu4a5zouMMBoqtgMTxLYM+Q+xRR4thMUGATwY0XeG4DnCXUUM9qCgMfXq/SnktcGa2o1fsu3PZSrCz9VkLhKpYpC/xzXytKYzOuDGJLz75gqKfCIoVcHg9FaQmV5hDOCfmiiCEJRx/Q/gMdfcLxEavl+A/GgiKLts0ezC+KupmR4p+08Tfh9A14rF/aosLmZpXjcptZPpbxXfsqqDq+w=="
    # zo-el
    "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC1smdy0NKOaUaNx0ASklOt+pP7+UZrOrZmz+Uv7iLoVz6OGbTANBCPydSYr9NvoHeTljSd8Ma7Gvk/V0qf3VrxJn3YfC45IIRAdh8mqnGzXKA0YM+WpyUVOwYRYSzL/5HqUsNXaQvSwNZ/Sa8gGCHwysIfsoZP4ABui6HmGAOxD+8tqeEjUqD3jEyyjhPbkw/tL2RCIl2oJVi4Mrm91cIHTXcv1uNSGt/16vbQ3lroXZN+rzPA+nZkEfaw+xpgpW7QQvTaWecwyYqSH/D4scqjF9wBzLRS6fKlde6CKTZ3t6VMKJ0nQVtC1k5VAYlaBPGgDFMbDnCPXnjjCz74YYnsyxCKbpdJxf4Nwt6jL0CD5p5ipvT7l7V1h2z+s4ib6lmaIxE37fLKAMLgFRwmaW3olUWQ3jGlmSbMqbZI9EXvXNdeiYORaJy/FOUOX56ZKRF5imWY2ePrd39el4D3MfTconUhJVuO7p15A/Y8LzLP9dbsKddAOxlEFhYdnac9UkizMNzjWyMOFT0WebnoMhpi0DxKZJz7r2OeuYQlhl+ppo96RjAfDo6q2NsJIeIvLedKt0Qy8hJZco9tRG/sQ3lSa2c23qVUhiZl+KkheLcBGdOjCGJjhPyLr4rT/uefFaW7Ln88rlnwFZF0yxutKMzK+wxaZ+S+mt+H8GW31fnKkQ=="
    # Alastair Ong
    "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDVC8WfgtvzgCXqRxdUdJCG+PaLDZVXYeKKm5M6C/8mB"
    # zippy
    "ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAz/DuFukuSTdfVnfahahnpGBiiRduW4MhrSb0+SJIMuloz1dZcCUAct6o6tHOo4w0xpGtfvjVx0HMsalrfErRAPDjZstxvg/LeVfS8bJPv2NJOy9wv3Q5/d3CDGqcd7T0HrT80ZxQeHFUh+fjoejQnCYmUl/eqrzsIdP/zP+dc63BzwU/4d1ENx9AzJc3rlOGzfTUP/rjFXfQkpDCNDZxEA4A/vCyr0j3EYEeDB2H5bsT02/+1dPy066ibQDWu7WmGdoq8hzimUFo4+y+7oBr6ndZ8iv4Yl8EGI05JhJaVT6MfWx73K7aCE8SBmJBStFYMrOJ/Ilx2K01QATuU8OxFw=="
  ];
}
