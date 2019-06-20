<?php

/**
 * @param Twig_Environment $env - The Twig Environment - https://twig.symfony.com/api/1.x/Twig_Environment.html
 * @param $config - Config of `@basalt/twig-renderer`
 */
function twigExtensions(\Twig_Environment &$env, $config) {

  // Load the \BasicTwigExtensions class so the extension can be added correctly.
  spl_autoload_register(function ($class_name) {
    include __DIR__ . '/' . $class_name . '.php';
  });

  $env->addExtension(new \Twig_Extension_Debug());
  $env->addExtension(new \BasicTwigExtensions());
}
