package com.nurtura.platform.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(AbstractHttpConfigurer::disable);
		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		http.authorizeHttpRequests(authorize -> authorize
				.requestMatchers("/api/public/**").permitAll()
				.requestMatchers("/api/management/**").hasAnyRole(
						ApplicationRole.PLATFORM_ADMIN.name(),
						ApplicationRole.MANAGEMENT.name()
				)
				.requestMatchers("/api/classroom/**").hasAnyRole(
						ApplicationRole.PLATFORM_ADMIN.name(),
						ApplicationRole.TEACHER.name()
				)
				.anyRequest().authenticated()
		);
		http.httpBasic(Customizer.withDefaults());
		return http.build();
	}

	@Bean
	public UserDetailsService userDetailsService(DevUsersProperties devUsersProperties, PasswordEncoder passwordEncoder) {
		UserDetails adminUser = User.builder()
				.username(devUsersProperties.getAdminUsername())
				.password(passwordEncoder.encode(devUsersProperties.getAdminPassword()))
				.roles(ApplicationRole.PLATFORM_ADMIN.name(), ApplicationRole.MANAGEMENT.name())
				.build();

		UserDetails teacherUser = User.builder()
				.username(devUsersProperties.getTeacherUsername())
				.password(passwordEncoder.encode(devUsersProperties.getTeacherPassword()))
				.roles(ApplicationRole.TEACHER.name())
				.build();

		return new InMemoryUserDetailsManager(adminUser, teacherUser);
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
