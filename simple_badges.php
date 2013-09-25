<?php
/**
 * @package simple-badges
 * @version 0.2.1
 */
/*
Plugin Name: Simple Badges
Description: A simple TinyMCE plugin to easily insert Play Store application and sources links badges in your posts.
Author: Gnufabio
Version: 0.2
Author URI: http://www.gnufabio.tk
License: GPLv3
*/
	
	include_once('local_constants.php');
	
	function get_badge_html($attrs, $content = null) {
		if(empty($source_hostings)) {
			include('local_constants.php');
		}
		
		foreach($source_hostings as $service => $service_url) {
			$$service = $attrs[$service];
		}
		
		$pkg = $attrs['pkg'];
		$size = $attrs['size'];
		$align = $attrs['align'];
		
		$img_alt = 'Get it on Google Play';
		
		//Check if align is given, and if is valid! 'center' is default.
		if (is_null($align) || empty($align)) {
			$align = 'center';
		} else {
			$left = strcmp($align, 'left');
			$right = strcmp($align, 'right');
			
			if($left == 0) {
				$align = 'left';
			} elseif ($right == 0) {
				$align = 'right';
			} else {
				$align = 'center';
			}
		}
		
		$img_url = plugins_url( 'images/googleplay_big_badge.png', __FILE__ );
		
		//Check if 'size' attribute is given
		if(!(is_null($size) || empty($size))) {
			if(strcmp($size, 'small') == 0) {
				$img_url = plugins_url( 'images/googleplay_small_badge.png', __FILE__ );;
			}	
		}
		
		if(!is_null($content) && !empty($content)) {
			$img_alt = $content;
		}
		
		$not_specified = (is_null($pkg) || empty($pkg));
		$href_url = (($not_specified) ? ('https://play.google.com/store/apps/') : ('https://play.google.com/store/apps/details?id=' . $pkg));
		
		$html = '<p align="' . $align . '">';
		
		if(!$not_specified) {
			$html .= '<a href="' . $href_url . '"><img src="' . $img_url . '" alt="' . $img_alt . '" /></a>';
		}
		
		foreach($source_hostings as $service => $service_url) {
			$html .= get_sources_html($source_hostings, $service, $$service, $size);
		}
		
		return $html . '</p>';
	}
	
	function get_sources_html($source_hostings, $hosting, $sources_id, $size) {
		if (!is_null($sources_id) && !empty($sources_id) && !is_null($hosting) && !empty($hosting)) {
			$sources_url = $source_hostings["$hosting"] . $sources_id;
			$img_name = 'images/' . $hosting . '_' . $size . '_badge.png';
			$img_url = plugins_url( $img_name, __FILE__ );
			$sources_html = '<a href="' . $sources_url . '"><img src="' .  $img_url . '" /></a>';
			return $sources_html;
		} else {
			return '';
		}
	}
	
	function add_badge_shortcode() {
		add_shortcode(constant('SHORTCODE'), 'get_badge_html');
	}
	
	add_action( 'init', 'badge_init_setup');
	
	function badge_init_setup(){
		add_badge_shortcode();
		
		if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') ) {
			return;
		}
		if ( get_user_option('rich_editing') == 'true' ) {
			add_filter( 'mce_external_plugins', 'add_badge_plugin' );
			add_filter( 'mce_buttons', 'register_badge_button' );
		}
	}

	function register_badge_button($buttons) {
		array_push( $buttons, "|", "simplebadges" );
		return $buttons;
	}

	function add_badge_plugin($plugin_array) {
		$plugin_array['simplebadges'] = plugins_url( 'js/simple_badges_button.js', __FILE__ );
		return $plugin_array;
	}
?>