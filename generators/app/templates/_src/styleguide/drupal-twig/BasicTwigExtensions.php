<?php

/**
 * These filters come from drupal-twig-extensions.
 *
 * See more: https://github.com/pattern-lab/drupal-twig-extensions.
 */
class BasicTwigExtensions extends Twig_Extension implements Twig_ExtensionInterface {

  /**
   * Dummy function that passes a param straight through.
   *
   * @return string
   *   Returns whatever param was passed in with no modifications.
   */
  public static function returnParam($param) {
    return $param;
  }

  /**
   * Dummy function that returns a simple '#'.
   *
   * @return string
   *   Returns a '#' character.
   */
  public static function inertHref() {
    return '#';
  }

  /**
   * Dummy function that returns nothing.
   *
   * @return string
   *   Returns a '' character.
   */
  public static function returnNothing() {
    return '';
  }

  /**
   * Returns a list of filters to add to the existing list.
   *
   * @link Drupal Twig Filters - https://www.drupal.org/docs/8/theming/twig/filters-modifying-variables-in-twig-templates
   *
   * @return Twig_SimpleFilter[]
   *   Returns a list of filters.
   */
  public function getFilters() {
    return [
      new Twig_SimpleFilter('t', [$this, 'returnParam']),
      new Twig_SimpleFilter('render', [$this, 'returnParam']),
      new Twig_SimpleFilter('placeholder', [$this, 'returnParam']),
      new Twig_SimpleFilter('without', [$this, 'returnParam']),
      new Twig_SimpleFilter('clean_class', [$this, 'returnParam']),
    ];
  }

  /**
   * Returns a list of functions to add to the existing list.
   *
   * @link Drupal Twig Functions - https://www.drupal.org/node/2486991
   *
   * @return Twig_SimpleFunction[]
   *   Returns list of functions.
   */
  public function getFunctions() {
    return [
      new Twig_SimpleFunction('url', [$this, 'inertHref']),
      new Twig_SimpleFunction('path', function ($string) {
        if ($string === '<front>') {
          return '/';
        }
        else {
          return $string;
        }
      }),
      new Twig_SimpleFunction('link', [$this, 'inertHref']),
      new Twig_SimpleFunction('file_url', [$this, 'returnParam']),
      new Twig_SimpleFunction('attach_library', [$this, 'returnNothing']),
    ];
  }

  /**
   * Returns a list of global variables to add to the existing list.
   *
   * @return array
   *   An array of global variables
   *
   * @deprecated since 1.23 (to be removed in 2.0), implement Twig_Extension_GlobalsInterface instead
   */
  public function getGlobals() {
    return [];
  }

  /**
   * Returns the name of the extension.
   *
   * @return string
   *   The extension name.
   *
   * @deprecated since 1.26 (to be removed in 2.0), not used anymore internally
   */
  public function getName() {
    return 'BasicTwigExtensions';
  }

}
