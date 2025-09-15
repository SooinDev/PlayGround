package com.playground.listener; // 패키지는 자유롭게

import com.mysql.cj.jdbc.AbandonedConnectionCleanupThread;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class MyServletContextListener implements ServletContextListener {

  @Override
  public void contextInitialized(ServletContextEvent sce) {
    // 애플리케이션 시작 시
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {
    // 애플리케이션 종료 시
    AbandonedConnectionCleanupThread.checkedShutdown();
  }
}